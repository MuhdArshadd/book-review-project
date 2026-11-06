const { Router } = require("express");
const bookApiRouter = require("./book-api.routes");

const router = Router();

router.use("/books", bookApiRouter);

module.exports = router;
