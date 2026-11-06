const pino = require("pino");
const { LOG_LEVEL, NODE_ENV } = require("../config/env.config");

const logger = pino({
  level: LOG_LEVEL,
  base: {
    service: "book-review-project",
    environment: NODE_ENV,
  },
});

module.exports = { logger };
