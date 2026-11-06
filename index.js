const app = require("./app");
const { db } = require("./models");
const { migrator } = require("./database/migrator");
const { PORT } = require("./config/env.config");
const { logger } = require("./utils/logger");

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const connectWithRetry = async (attempts = 5) => {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await db.authenticate();
      return;
    } catch (error) {
      if (attempt === attempts) throw error;
      logger.warn({ attempt, error: error.message }, "Database connection failed; retrying");
      await wait(attempt * 1000);
    }
  }
};

const startServer = async () => {
  await connectWithRetry();
  await migrator.up();

  const server = app.listen(PORT, "0.0.0.0", () => {
    logger.info({ port: PORT }, `Book Collection is running on port ${PORT}`);
  });

  let shuttingDown = false;
  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "Graceful shutdown started");

    const forceTimer = setTimeout(() => {
      logger.error("Graceful shutdown timed out");
      process.exit(1);
    }, 10000);
    forceTimer.unref();

    server.close(async () => {
      try {
        await db.close();
        clearTimeout(forceTimer);
        logger.info("Graceful shutdown complete");
        process.exit(0);
      } catch (error) {
        logger.error({ error }, "Database shutdown failed");
        process.exit(1);
      }
    });
  };

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
  return server;
};

if (require.main === module) {
  startServer().catch((error) => {
    logger.error({ error }, "Unable to start the server");
    process.exitCode = 1;
  });
}

module.exports = { startServer, connectWithRetry };
