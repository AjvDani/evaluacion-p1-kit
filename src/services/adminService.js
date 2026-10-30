const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const createSchedule = async ({ court, startTime, endTime }) => {
  return prisma.schedule.create({
    data: { court, startTime, endTime },
  });
};

const getBookings = async () => {
  return prisma.booking.findMany({
    include: {
      user: true,
      schedule: true,
    },
  });
};

module.exports = { createSchedule, getBookings };
