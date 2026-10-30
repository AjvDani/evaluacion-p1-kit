const {
  findBookingByDateAndSchedule,
  createBooking: createBookingService,
  updateBooking: updateBookingService,
  deleteBooking: deleteBookingService,
} = require("../services/bookingService");

const parseBookingData = (body) => {
  const { date, scheduleId } = body;
  if (!date || scheduleId === undefined || scheduleId === null) {
    return { error: "date y scheduleId son obligatorios" };
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return { error: "La fecha no es válida" };
  }

  const parsedScheduleId = Number(scheduleId);
  if (!Number.isInteger(parsedScheduleId)) {
    return { error: "scheduleId debe ser un número entero" };
  }

  return { date: parsedDate, scheduleId: parsedScheduleId };
};

const createBooking = async (req, res) => {
  try {
    const data = parseBookingData(req.body);
    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    const occupied = await findBookingByDateAndSchedule(
      data.date,
      data.scheduleId,
    );
    if (occupied) {
      return res.status(400).json({ error: "El horario ya está ocupado" });
    }

    const booking = await createBookingService({
      date: data.date,
      scheduleId: data.scheduleId,
      userId: req.user.id,
    });
    return res.status(201).json(booking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getBooking = async (req, res) => {
  return res.json(req.booking);
};

const updateBooking = async (req, res) => {
  try {
    const data = parseBookingData(req.body);
    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    const occupied = await findBookingByDateAndSchedule(
      data.date,
      data.scheduleId,
      req.booking.id,
    );
    if (occupied) {
      return res.status(400).json({ error: "El horario ya está ocupado" });
    }

    const booking = await updateBookingService(req.booking.id, data);
    return res.json(booking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    await deleteBookingService(req.booking.id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getBooking, updateBooking, deleteBooking };
