const {
  createSchedule: createScheduleService,
  getBookings,
} = require("../services/adminService");

const isAdmin = (req, res) => {
  if (req.user?.role !== "ADMIN") {
    res.status(403).json({ error: "Acceso denegado: se requiere rol ADMIN" });
    return false;
  }
  return true;
};

const createSchedule = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const { court, startTime, endTime } = req.body;
    if (!court || !startTime || !endTime) {
      return res
        .status(400)
        .json({ error: "court, startTime y endTime son obligatorios" });
    }
    const schedule = await createScheduleService({ court, startTime, endTime });
    return res.status(201).json(schedule);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const listBookings = async (req, res) => {
  if (!isAdmin(req, res)) return;
  try {
    const bookings = await getBookings();
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createSchedule, listBookings };
