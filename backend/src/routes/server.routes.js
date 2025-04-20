const express = require("express");
const { check } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const serverController = require("../controllers/server.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { triggerPing } = require("../utils/scheduler");

const prisma = new PrismaClient();
const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// @route   GET api/servers
// @desc    Get all servers for authenticated user
// @access  Private
router.get("/", serverController.getServers);

// @route   GET api/server
// @desc    Get server pings with date filter
// @access  Private
router.get("/server-pings", serverController.getServerPings);

// @route   GET api/servers/:id
// @desc    Get server by ID
// @access  Private
router.get("/:id", serverController.getServerById);

// @route   POST api/servers
// @desc    Create a new server
// @access  Private
router.post(
  "/",
  [
    check("url", "Valid URL is required").isURL(),
    check("name", "Name is required").not().isEmpty(),
  ],
  serverController.createServer
);

// @route   PUT api/servers/:id
// @desc    Update server
// @access  Private
router.put(
  "/:id",
  [
    check("url", "URL must be valid if provided").optional().isURL(),
    check("name", "Name must not be empty if provided")
      .optional()
      .not()
      .isEmpty(),
    check("pingInterval", "Ping interval must be a positive number")
      .optional()
      .isInt({ min: 30 }),
  ],
  serverController.updateServer
);

// @route   DELETE api/servers/:id
// @desc    Delete server
// @access  Private
router.delete("/:id", serverController.deleteServer);

// @route   PUT api/servers/:id/alerts
// @desc    Update alert settings for a server
// @access  Private
router.put(
  "/:id/alerts",
  [
    check("failureThreshold", "Failure threshold must be a positive number")
      .optional()
      .isInt({ min: 1 }),
    check(
      "responseTimeThreshold",
      "Response time threshold must be a positive number"
    )
      .optional()
      .isInt({ min: 100 }),
  ],
  serverController.updateAlertSettings
);

// @route   POST api/servers/:id/ping
// @desc    Manually ping a server
// @access  Private
router.post("/:id/ping", async (req, res) => {
  try {
    // Check if server exists and belongs to user
    const server = await prisma.server.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    // Trigger a manual ping
    const pingResult = await triggerPing(req.params.id);

    res.json(pingResult);
  } catch (err) {
    console.error("Manual ping error:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
