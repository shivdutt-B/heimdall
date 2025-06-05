const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const { refreshServerCache } = require("../utils/scheduler");

const prisma = new PrismaClient();

/**
 * Get all servers for authenticated user
 * @route GET /api/servers
 */

/*
 * In response don't send whole ping history, send only last 10 pings, and each ping object should only have id, status, timestamp, responseTime.
 */
exports.getServers = async (req, res) => {
  try {
    const servers = await prisma.server.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(servers);
  } catch (err) {
    console.error("Get servers error:", err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Get server by ID
 * @route GET /api/servers/:id
 */
exports.getServerById = async (req, res) => {
  try {
    // Get server details
    const server = await prisma.server.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    // Get ping statistics
    const pingStats = await prisma.pingHistory.groupBy({
      by: ["status"],
      where: {
        serverId: req.params.id,
      },
      _count: {
        status: true,
      },
    });

    // Calculate total pings and successful/failed counts
    const totalPings = pingStats.reduce(
      (acc, curr) => acc + curr._count.status,
      0
    );
    const successfulPings =
      pingStats.find((p) => p.status === true)?._count.status || 0;
    const failedPings =
      pingStats.find((p) => p.status === false)?._count.status || 0;

    // Add stats to response
    const response = {
      ...server,
      pingStats: {
        total: totalPings,
        successful: successfulPings,
        failed: failedPings,
        successRate:
          totalPings > 0
            ? ((successfulPings / totalPings) * 100).toFixed(1)
            : 0,
      },
    };

    res.json(response);
  } catch (err) {
    console.error("Get server error:", err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Create a new server
 * @route POST /api/servers
 */
exports.createServer = async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url, name, pingInterval } = req.body;
  console.log(req.body);

  try {
    // Prevent duplicate servers (by url or name for this user)
    const existingServer = await prisma.server.findFirst({
      where: {
        userId: req.user.id,
        OR: [{ url: url }, { name: name }],
      },
    });
    if (existingServer) {
      return res
        .status(400)
        .json({ message: "A server with this URL or name already exists." });
    }

    // Create server with default alert settings
    const server = await prisma.server.create({
      data: {
        url,
        name,
        pingInterval: pingInterval || 300, // Default to 5 minutes
        userId: req.user.id,
      },
    });

    // Refresh the server cache to include the new server
    // await refreshServerCache();

    res.status(201).json(server);
  } catch (err) {
    console.error("Create server error:", err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Update server
 * @route PUT /api/servers/:id
 */
exports.updateServer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url, name, isActive, pingInterval } = req.body;

  try {
    // Check if server exists and belongs to user
    const existingServer = await prisma.server.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existingServer) {
      return res.status(404).json({ message: "Server not found" });
    }

    // Update server
    const server = await prisma.server.update({
      where: {
        id: req.params.id,
      },
      data: {
        url: url || existingServer.url,
        name: name || existingServer.name,
        isActive: isActive !== undefined ? isActive : existingServer.isActive,
        pingInterval: pingInterval || existingServer.pingInterval,
      },
    });

    // Refresh the server cache to update the server's properties
    await refreshServerCache();

    res.json(server);
  } catch (err) {
    console.error("Update server error:", err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Delete server
 * @route DELETE /api/servers/:id
 */
exports.deleteServer = async (req, res) => {
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

    // Delete server (will cascade delete related records)
    await prisma.server.delete({
      where: {
        id: req.params.id,
      },
    });

    // Refresh the server cache to remove the deleted server
    await refreshServerCache();

    res.json({ message: "Server removed" });
  } catch (err) {
    console.error("Delete server error:", err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Get server pings with date filter
 * @route GET /api/server
 */
exports.getServerPings = async (req, res) => {
  try {
    const { id, days } = req.query;
    const daysNum = parseInt(days);

    if (!id || !days || isNaN(daysNum)) {
      return res.status(400).json({ message: "Invalid parameters" });
    }

    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // Get server pings within date range
    const pings = await prisma.pingHistory.findMany({
      where: {
        serverId: id,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    // Calculate total pages for pagination
    const totalPings = await prisma.pingHistory.count({
      where: {
        serverId: id,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    res.json({
      pings,
      totalPings,
      startDate,
      endDate,
    });
  } catch (err) {
    console.error("Get server pings error:", err.message);
    res.status(500).send("Server error");
  }
};
