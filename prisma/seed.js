require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Paulo Galarza",
      email: "paulo.galarza@example.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Jose Villa",
      email: "jdvilla3@espe.edu.ec",
      password: userPassword,
      role: "USER",
    },
  });

  const paddel = await prisma.schedule.create({
    data: {
      court: "Pádel 3",
      startTime: "08:00",
      endTime: "10:00",
    },
  });

  const ecuavoley = await prisma.schedule.create({
    data: {
      court: "Ecuavóley 3",
      startTime: "10:00",
      endTime: "12:00",
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date("2026-11-23T00:00:00.000Z"),
      user: { connect: { id: user.id } },
      schedule: { connect: { id: paddel.id } },
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date("2026-11-23T00:00:00.000Z"),
      user: { connect: { id: admin.id } },
      schedule: { connect: { id: ecuavoley.id } },
    },
  });

  console.log("Seed completado: 2 usuarios, 2 horarios y 2 reservas");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
