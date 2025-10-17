import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create test users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: passwordHash,
      name: 'Admin User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@example.com',
      password: passwordHash,
      name: 'Instructor User',
      role: 'INSTRUCTOR',
      isActive: true,
    },
  });

  const client = await prisma.user.create({
    data: {
      email: 'client@example.com',
      password: passwordHash,
      name: 'Client User',
      role: 'CLIENTE',
      isActive: true,
    },
  });

  // Assign active memberships
  await prisma.membership.create({
    data: {
      userId: admin.id,
      plan: 'Admin Plan',
      endDate: new Date('2025-12-31'),
    },
  });

  await prisma.membership.create({
    data: {
      userId: instructor.id,
      plan: 'Instructor Plan',
      endDate: new Date('2025-12-31'),
    },
  });

  await prisma.membership.create({
    data: {
      userId: client.id,
      plan: 'Client Plan',
      endDate: new Date('2025-12-31'),
    },
  });

  console.log('Test users and memberships created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });