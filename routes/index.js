const { Router } = require("express");
const bookRouter = require("./book.routes");
const apiRouter = require("./api");
const healthRouter = require("./health.routes");

const router = Router();

router.get("/", (req, res) => res.redirect("/books"));
router.use("/health", healthRouter);
router.use("/api/v1", apiRouter);
router.use("/books", bookRouter);

module.exports = router;
