const { getBookingsByUser } = require("../services/userService");

const getUserBookings = async (req, res) => {
  try {
    const bookings = await getBookingsByUser(Number(req.params.id));
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getUserBookings };
