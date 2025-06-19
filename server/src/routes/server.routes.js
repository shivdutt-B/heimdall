const express = require("express");
const { check } = require("express-validator");
const serverController = require("../controllers/server.controller");
const authMiddleware = require("../middleware/auth.middleware");

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
    check("url", "URL must be valid if provided")
      .optional()
      .matches(/^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/)
      .withMessage("URL must be in the format https://xyz.abc.com"),
    check("name", "Name is required").not().isEmpty(),
    check("pingInterval", "Ping interval must be at least 300 seconds (5 minutes)")
      .optional()
      .isInt({ min: 300 }),
    check(
      "failureThreshold",
      "Failure threshold must be an integer between 1 and 10"
    )
      .optional()
      .isInt({ min: 1, max: 10 }),
  ],
  serverController.createServer
);

// @route   PUT api/servers/:id
// @desc    Update server
// @access  Private
router.put(
  "/:id",
  [
    check("url", "URL must be valid if provided")
      .optional()
      .matches(/^https:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+$/)
      .withMessage("URL must be in the format https://xyz.abc.com"),
    check("name", "Name must not be empty if provided")
      .optional()
      .not()
      .isEmpty(), check("pingInterval", "Ping interval must be at least 300 seconds (5 minutes)")
        .optional()
        .isInt({ min: 300 }),
    check(
      "failureThreshold",
      "Failure threshold must be an integer between 1 and 10"
    )
      .optional()
      .isInt({ min: 1, max: 10 }),
  ],
  serverController.updateServer
);

// @route   DELETE api/servers/:id
// @desc    Delete server
// @access  Private
router.delete("/:id", serverController.deleteServer);

// @route   POST api/servers/memory-history
// @desc    Get memory history for a server
// @access  Private
router.post("/memory-history", serverController.getMemoryHistory);


module.exports = router;
