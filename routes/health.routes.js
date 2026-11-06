const { Router } = require("express");
const { live, ready } = require("../controllers/health.controller");

const router = Router();

router.get("/live", live);
router.get("/ready", ready);

module.exports = router;
