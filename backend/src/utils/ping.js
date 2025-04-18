const axios = require("axios");
const { PrismaClient } = require("@prisma/client");
const { sendServerDownAlert, sendServerRecoveredAlert } = require("./email");

const prisma = new PrismaClient();

/**
 * Ping a server and record the result
 * @param {string} serverId - The ID of the server to ping
 * @returns {Promise<Object>} - The ping result
 */
const pingServer = async (serverId) => {
  try {
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      include: {
        alertSettings: true,
        user: {
          select: {
            email: true,
            settings: {
              select: {
                emailNotifications: true,
              },
            },
          },
        },
      },
    });

    if (!server || !server.isActive) {
      console.log(`Server ${serverId} is not active or doesn't exist`);
      return null;
    }

    const startTime = Date.now();
    let success = false;
    let statusCode = null;
    let responseTime = null;
    let heapUsage = null;
    let rssMemory = null;

    try {
      // Try to ping the server's health check endpoint
      const pingEndpoint = `${server.url.replace(/\/$/, "")}/__ping__`;
      const result = await makeRequest(pingEndpoint);
      success = true;
      statusCode = result.status;
      responseTime = Date.now() - startTime;
      totalHeap = result.data.memory.heapTotal;
      totalRss = result.data.memory.external;

      // Extract memory usage from the response if available
      if (result.data && result.data.memory) {
        if (result.data.memory.heapUsed) {
          heapUsage = result.data.memory.heapUsed;
        }
        if (result.data.memory.rss) {
          rssMemory = result.data.memory.rss;
        }
      }
    } catch (error) {
      success = false;
      statusCode = error.response?.status;
      console.error(`Error pinging ${server.url}:`, error.message);
    }

    // Record ping history
    const pingRecord = await prisma.pingHistory.create({
      data: {
        serverId,
        status: success,
        responseTime,
        statusCode,
        heapUsage,
        rssMemory,
        totalHeap,
        totalRss,
      },
    });

    // Update server's last pinged time
    await prisma.server.update({
      where: { id: serverId },
      data: { lastPingedAt: new Date() },
    });

    // Check if we need to send alerts
    await checkAlertStatus(server, success);

    return {
      id: pingRecord.id,
      serverId,
      status: success,
      responseTime,
      statusCode,
      heapUsage,
      rssMemory,
      timestamp: pingRecord.timestamp,
    };
  } catch (error) {
    console.error(`Error during ping process for server ${serverId}:`, error);
    return null;
  }
};

/**
 * Make an HTTP/HTTPS request to the given URL using axios
 * @param {string} url - The URL to request
 * @returns {Promise<Object>} - The response
 */
const makeRequest = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 20000,
      validateStatus: (status) => status < 500, // Any status code less than 500 is considered a success
    });

    // The response from the ping endpoint will include:
    // {
    //   status: 'ok',
    //   message: 'Ping successful',
    //   timestamp: '2023-...',
    //   memory: {
    //     heapUsed: 12.34, // MB
    //     rss: 56.78 // MB
    //   }
    // }
    console.log("================================================");
    console.log("Ping response:", response.data);
    console.log("================================================");

    return response;
  } catch (error) {
    if (error.response && error.response.status >= 500) {
      throw new Error(
        `Server responded with status code ${error.response.status}`
      );
    }
    throw error;
  }
};

/**
 * Check if we need to send alerts based on ping history
 * @param {Object} server - The server object
 * @param {boolean} currentStatus - The current ping status
 */
const checkAlertStatus = async (server, currentStatus) => {
  try {
    // Get recent ping history for this server
    const recentPings = await prisma.pingHistory.findMany({
      where: { serverId: server.id },
      orderBy: { timestamp: "desc" },
      take: 10,
    });

    // Skip if no ping history yet
    if (recentPings.length < server.alertSettings.failureThreshold) {
      return;
    }

    // Only consider the most recent pings up to the failure threshold
    const relevantPings = recentPings.slice(
      0,
      server.alertSettings.failureThreshold
    );

    // Check if all recent pings have failed (excluding the current one)
    const allRecentFailed = relevantPings.every((ping) => !ping.status);

    // Check if server was down but is now back up
    const wasDown = relevantPings.every((ping) => !ping.status);
    const isNowUp = currentStatus;

    const shouldSendAlerts =
      server.alertSettings.emailNotifications &&
      server.user.settings.emailNotifications;

    if (shouldSendAlerts) {
      // Send alert if server is down
      if (allRecentFailed && !currentStatus) {
        // Calculate approximate downtime in minutes based on ping interval
        const downtime = Math.round(
          (server.alertSettings.failureThreshold * server.pingInterval) / 60
        );

        await sendServerDownAlert({
          to: server.user.email,
          serverName: server.name,
          serverUrl: server.url,
          downtime,
        });

        console.log(`Sent down alert for server ${server.name}`);
      }

      // Send recovery alert if server was down but is now up
      if (wasDown && isNowUp) {
        // Calculate approximate downtime in minutes based on ping history
        // This is a simplified calculation
        const downtime = Math.round(
          (relevantPings.length * server.pingInterval) / 60
        );

        await sendServerRecoveredAlert({
          to: server.user.email,
          serverName: server.name,
          serverUrl: server.url,
          downtime,
        });

        console.log(`Sent recovery alert for server ${server.name}`);
      }
    }
  } catch (error) {
    console.error(
      `Error checking alert status for server ${server.id}:`,
      error
    );
  }
};

module.exports = {
  pingServer,
};
