const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const getBookingById = async (id) => {
  return prisma.booking.findUnique({ where: { id } });
};

const findBookingByDateAndSchedule = async (date, scheduleId, excludeId) => {
  return prisma.booking.findFirst({
    where: {
      date,
      scheduleId,
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
};

const createBooking = async ({ date, scheduleId, userId }) => {
  return prisma.booking.create({
    data: { date, scheduleId, userId },
  });
};

const updateBooking = async (id, { date, scheduleId }) => {
  return prisma.booking.update({
    where: { id },
    data: { date, scheduleId },
  });
};

const deleteBooking = async (id) => {
  return prisma.booking.delete({ where: { id } });
};

module.exports = {
  getBookingById,
  findBookingByDateAndSchedule,
  createBooking,
  updateBooking,
  deleteBooking,
};
