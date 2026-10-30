const { getBookingById } = require("../services/bookingService");

const authorizeBooking = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const booking = await getBookingById(id);
    if (!booking) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    const isOwner = booking.userId === req.user.id;
    const isAdmin = req.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ error: "No autorizado para acceder a esta reserva" });
    }

    req.booking = booking;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = authorizeBooking;
