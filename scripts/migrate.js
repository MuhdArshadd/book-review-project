const { db } = require("../models");
const { migrator } = require("../database/migrator");
const { logger } = require("../utils/logger");

const runMigrations = async () => {
  try {
    await db.authenticate();
    const migrations = await migrator.up();
    logger.info(
      { migrations: migrations.map((item) => item.name) },
      "Database migrations complete",
    );
  } finally {
    await db.close();
  }
};

if (require.main === module) {
  runMigrations().catch((error) => {
    logger.error({ error }, "Database migration failed");
    process.exitCode = 1;
  });
}

module.exports = { runMigrations };
