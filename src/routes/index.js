const { Router } = require("express");
const authRouter = require("./auth");
const adminRouter = require("./admin");

const router = Router();

router.use("/auth", authRouter);
router.use("/admin", adminRouter);
// Monta aquí tus routers de los hitos 3 y 4

module.exports = router;
