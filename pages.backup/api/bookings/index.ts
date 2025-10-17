import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]'; // Updated import path to app/api/auth
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userEmail = session.user?.email;

  try {
    if (req.method === 'GET') {
      const { filter = 'upcoming' } = req.query;

      // Fixing type errors in the Prisma queries
      const now = new Date();

      // Adjusting the type inference dynamically for BookingWhereInput
      const whereClause: Prisma.BookingWhereInput = {
        userEmail,
        ...(filter === 'upcoming' && {
          startTime: { gt: now },
          status: 'confirmed',
        }),
        ...(filter === 'past' && {
          endTime: { lt: now },
          status: 'confirmed',
        }),
        ...(filter === 'cancelled' && {
          status: 'cancelled',
        }),
      };

      const bookings = await prisma.booking.findMany({
        where: whereClause,
        include: {
          class: true,
        },
        orderBy: {
          startTime: filter === 'past' ? 'desc' : 'asc',
        },
      });

      return res.status(200).json(bookings);
    }

    if (req.method === 'POST') {
      const { classId } = req.body;

      if (!classId || typeof classId !== 'string') {
        return res.status(400).json({ error: 'Invalid classId' });
      }

      const now = new Date();

      const classDetail = await prisma.class.findUnique({
        where: { id: classId },
        include: { bookings: true },
      });

      if (!classDetail) {
        return res.status(404).json({ error: 'Class not found' });
      }

      if (classDetail.startTime <= now) {
        return res.status(400).json({ error: 'Class has already started' });
      }

      const membership = await prisma.membership.findUnique({
        where: { userEmail },
      });

      if (!membership || !membership.isActive) {
        return res.status(403).json({ error: 'No active membership' });
      }

      if (membership.creditsLeft !== null && membership.creditsLeft <= 0) {
        return res.status(403).json({ error: 'Not enough credits' });
      }

      const existingBooking = await prisma.booking.findFirst({
        where: { userEmail, classId, status: 'confirmed' },
      });

      if (existingBooking) {
        return res.status(409).json({ error: 'Already booked for this class' });
      }

      if (classDetail.capacity <= classDetail.bookings.length) {
        return res.status(409).json({ error: 'Class is full' });
      }

      // Explicitly typing the transaction parameter
      const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const newBooking = await tx.booking.create({
          data: {
            userEmail,
            classId,
            status: 'confirmed',
            startTime: classDetail.startTime,
            endTime: classDetail.endTime,
          },
        });

        if (membership.creditsLeft !== null) {
          await tx.membership.update({
            where: { userEmail },
            data: { creditsLeft: membership.creditsLeft - 1 },
          });
        }

        return newBooking;
      });

      const bookingWithClass = await prisma.booking.findUnique({
        where: { id: booking.id },
        include: { class: true },
      });

      return res.status(201).json(bookingWithClass);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}