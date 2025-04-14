const { PrismaClient } = require("@prisma/client");
const { pingServer } = require("./ping");

const prisma = new PrismaClient();

// Keep track of active timers for each server
const serverTimers = new Map();
// Keep track of server cache refresh timer
let serverCacheRefreshTimer = null;
// Default refresh interval (5 minutes)
const CACHE_REFRESH_INTERVAL = 1 * 60 * 1000;

/**
 * Initialize the scheduler
 * Loads all active servers and schedules pings for them
 */
const initializeScheduler = async () => {
  try {
    console.log("Initializing server ping scheduler...");

    // Perform initial load of servers
    await refreshServerCache();

    // Set up periodic refresh of server cache
    serverCacheRefreshTimer = setInterval(async () => {
      console.log("Refreshing server cache...");
      await refreshServerCache();
    }, CACHE_REFRESH_INTERVAL);

    console.log(
      `Server cache will refresh every ${
        CACHE_REFRESH_INTERVAL / 60000
      } minutes`
    );
  } catch (error) {
    console.error("Error initializing scheduler:", error);
  }
};

/**
 * Refresh the server cache and update schedules
 */
const refreshServerCache = async () => {
  try {
    console.log("------------ Getting all active servers ------------");
    // Get all active servers
    const servers = await prisma.server.findMany({
      where: {
        isActive: true,
      },
    });

    console.log(`Found ${servers.length} active servers to monitor`);

    // Track current server IDs in the database
    const currentServerIds = new Set(servers.map((server) => server.id));

    // Remove schedules for servers that are no longer active or have been deleted
    for (const serverId of serverTimers.keys()) {
      if (!currentServerIds.has(serverId)) {
        clearServerTimer(serverId);
        console.log(
          `Removed monitoring for inactive/deleted server ${serverId}`
        );
      }
    }

    // Schedule pings for each active server
    servers.forEach((server) => {
      if (!serverTimers.has(server.id)) {
        // Only add new servers that aren't already being monitored
        scheduleServerPing(server.id, server.pingInterval);
        console.log(
          `Added new server ${server.id} (${server.name}) to monitoring`
        );
      } else if (server.pingInterval !== getPingInterval(server.id)) {
        // Update interval if it has changed
        updateServer(server.id, server.pingInterval);
        console.log(
          `Updated ping interval for server ${server.id} (${server.name})`
        );
      }
    });

    console.log(`Currently monitoring ${serverTimers.size} servers`);
  } catch (error) {
    console.error("Error refreshing server cache:", error);
  }
};

/**
 * Get the current ping interval for a server from its timer
 * @param {string} serverId - The ID of the server
 * @returns {number | null} - The interval in seconds or null if not found
 */
const getPingInterval = (serverId) => {
  if (!serverTimers.has(serverId)) {
    return null;
  }

  // This is a workaround as NodeJS doesn't provide a direct way to get
  // the interval of a timer. We'll need to track this separately.
  const timer = serverTimers.get(serverId);
  return timer._interval ? timer._interval / 1000 : null;
};

/**
 * Schedule a ping for a specific server
 * @param {string} serverId - The ID of the server to ping
 * @param {number} interval - The interval in seconds
 */
const scheduleServerPing = (serverId, interval) => {
  // Clear any existing timer for this server
  clearServerTimer(serverId);

  // Convert interval to milliseconds (interval is in seconds)
  const intervalMs = interval * 1000;

  // Schedule regular pings
  const timerId = setInterval(async () => {
    try {
      await pingServer(serverId);
    } catch (error) {
      console.error(`Error pinging server ${serverId}:`, error);
    }
  }, intervalMs);

  // Store the interval for reference
  timerId._interval = intervalMs;

  // Store the timer ID
  serverTimers.set(serverId, timerId);

  console.log(
    `Scheduled pings for server ${serverId} every ${interval} seconds`
  );
};

/**
 * Clear the timer for a specific server
 * @param {string} serverId - The ID of the server
 */
const clearServerTimer = (serverId) => {
  if (serverTimers.has(serverId)) {
    clearInterval(serverTimers.get(serverId));
    serverTimers.delete(serverId);
    console.log(`Cleared ping schedule for server ${serverId}`);
  }
};

/**
 * Add a new server to the scheduler
 * @param {string} serverId - The ID of the server to add
 * @param {number} interval - The ping interval in seconds
 */
const addServer = (serverId, interval) => {
  scheduleServerPing(serverId, interval);
};

/**
 * Remove a server from the scheduler
 * @param {string} serverId - The ID of the server to remove
 */
const removeServer = (serverId) => {
  clearServerTimer(serverId);
};

/**
 * Update a server's ping interval
 * @param {string} serverId - The ID of the server to update
 * @param {number} interval - The new ping interval in seconds
 */
const updateServer = (serverId, interval) => {
  scheduleServerPing(serverId, interval);
};

/**
 * Trigger a manual ping for a specific server
 * @param {string} serverId - The ID of the server to ping
 * @returns {Promise<Object>} - The ping result
 */
const triggerPing = async (serverId) => {
  try {
    return await pingServer(serverId);
  } catch (error) {
    console.error(`Error triggering ping for server ${serverId}:`, error);
    throw error;
  }
};

/**
 * Shutdown the scheduler
 * Clears all timers
 */
const shutdownScheduler = () => {
  console.log("Shutting down scheduler...");

  // Clear the server cache refresh timer
  if (serverCacheRefreshTimer) {
    clearInterval(serverCacheRefreshTimer);
    console.log("Cleared server cache refresh timer");
  }

  // Clear all server ping timers
  for (const [serverId, timerId] of serverTimers.entries()) {
    clearInterval(timerId);
    console.log(`Cleared ping schedule for server ${serverId}`);
  }

  serverTimers.clear();
  console.log("Scheduler shut down");
};

module.exports = {
  initializeScheduler,
  addServer,
  removeServer,
  updateServer,
  triggerPing,
  shutdownScheduler,
  refreshServerCache, // Export this to allow manual cache refresh
};
