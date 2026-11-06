const { randomUUID } = require("crypto");
const pinoHttp = require("pino-http");
const { logger } = require("../utils/logger");

const requestLogger = pinoHttp({
  logger,
  genReqId(req, res) {
    const requestId = req.headers["x-request-id"] || randomUUID();
    res.setHeader("x-request-id", requestId);
    return requestId;
  },
  customProps(req) {
    return { requestId: req.id };
  },
});

module.exports = { requestLogger };
