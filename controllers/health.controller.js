const asyncHandler = require("express-async-handler");
const { db } = require("../models");

const live = (req, res) => {
  res.status(200).json({
    data: {
      status: "ok",
      service: "book-review-project",
      timestamp: new Date().toISOString(),
    },
  });
};

const ready = asyncHandler(async (req, res) => {
  await db.query("SELECT 1");
  res.status(200).json({
    data: {
      status: "ready",
      database: "connected",
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = { live, ready };
