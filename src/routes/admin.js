const { Router } = require("express");
const authenticateToken = require("../middlewares/auth");
const {
  createSchedule,
  listBookings,
} = require("../controllers/adminController");

const router = Router();

router.use(authenticateToken);

router.post("/schedules", createSchedule);
router.get("/bookings", listBookings);

module.exports = router;
