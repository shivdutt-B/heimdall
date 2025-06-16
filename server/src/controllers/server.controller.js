const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");

const prisma = new PrismaClient();

/**
 * Get all servers for authenticated user
 * @route GET /api/servers
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
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { url, name, pingInterval, failureThreshold } = req.body;

  try {    // Prevent duplicate servers (by url or name across all users)
    const existingServer = await prisma.server.findFirst({
      where: {
        OR: [{ url: url }, { name: name }],
      },
    });
    if (existingServer) {
      if (existingServer.name === name) {
        return res.status(400).json({ message: "This server name is already in use." });
      }
      if (existingServer.url === url) {
        return res.status(400).json({ message: "This server URL is already being monitored." });
      }
    }

    // Create server with default alert settings
    const server = await prisma.server.create({
      data: {
        url,
        name,
        pingInterval: pingInterval || 300, // Default to 5 minutes
        failureThreshold: failureThreshold || 3,
        userId: req.user.id,
      },
    });

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

  const { url, name, isActive, pingInterval, failureThreshold } = req.body;

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
    }    // If name or url is being updated, check for duplicates across all users
    if (name || url) {
      const duplicateServer = await prisma.server.findFirst({
        where: {
          id: { not: req.params.id }, // Exclude current server
          OR: [
            { name: name || undefined },
            { url: url || undefined }
          ]
        },
      });

      if (duplicateServer) {
        if (duplicateServer.name === name) {
          return res.status(400).json({ message: "This server name is already in use by another user" });
        }
        if (duplicateServer.url === url) {
          return res.status(400).json({ message: "This server URL is already being monitored by another user" });
        }
      }
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
        failureThreshold:
          failureThreshold || existingServer.failureThreshold || 3,
      },
    });

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

    res.json({ message: "Server removed" });
  } catch (err) {
    console.error("Delete server error:", err.message);
    res.status(500).send("Server error");
  }
};

/**
 * Get server pings with date filter and pagination
 * @route GET /api/servers/server-pings
 */
exports.getServerPings = async (req, res) => {
  try {
    const { id, days, page = 1, limit = 10 } = req.query;
    const daysNum = parseInt(days);
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    if (!id || !days || isNaN(daysNum)) {
      return res.status(400).json({ message: "Invalid parameters" });
    }
    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);
    // Get server pings within date range, paginated
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
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });
    // Calculate total pings for pagination
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
      page: pageNum,
      limit: limitNum,
      startDate,
      endDate,
      hasMore: pageNum * limitNum < totalPings,
    });
  } catch (err) {
    console.error("Get server pings error:", err.message);
    res.status(500).send("Server error");
  }
};
