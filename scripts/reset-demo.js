const { db } = require("../models");
const { migrator } = require("../database/migrator");
const { resetDemoData } = require("../database/reset-demo");
const { logger } = require("../utils/logger");
const { NODE_ENV } = require("../config/env.config");

const runReset = async () => {
  const confirmed = process.env.CONFIRM_DEMO_RESET === "RESET_PUBLIC_DEMO";
  if (!confirmed && NODE_ENV !== "test") {
    throw new Error("Set CONFIRM_DEMO_RESET=RESET_PUBLIC_DEMO before resetting demo data");
  }

  try {
    await db.authenticate();
    await migrator.up();
    await resetDemoData();
    logger.info("Public demo data reset complete");
  } finally {
    await db.close();
  }
};

if (require.main === module) {
  runReset().catch((error) => {
    logger.error({ error }, "Public demo reset failed");
    process.exitCode = 1;
  });
}

module.exports = { runReset };
