import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]'; // Corrected import path
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userEmail = session.user?.email;
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: id as string },
        include: { class: true },
      });

      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      if (booking.userEmail !== userEmail) {
        return res.status(403).json({ error: 'You do not have permission to cancel this booking' });
      }

      const now = new Date();
      const diffHours = (new Date(booking.class.startTime).getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours < 2) {
        return res.status(400).json({ error: 'No se puede cancelar con menos de 2 horas de anticipación' });
      }

      if (booking.status === 'cancelled') {
        return res.status(400).json({ error: 'Booking is already cancelled' });
      }

      // Only cancel booking, do NOT refund credits
      const cancelledBooking = await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'cancelled' },
      });
      return res.status(200).json({ message: 'Booking cancelled successfully', booking: cancelledBooking });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['PUT']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}