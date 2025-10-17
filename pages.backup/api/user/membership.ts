import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

interface MembershipResponse {
  planType: string;
  creditsLeft: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  daysRemaining: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MembershipResponse | { error: string } | { redirect: string } | { hasMembership: boolean; message: string }>) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userEmail = session.user?.email;

  try {
    if (req.method === 'GET') {
      console.log('User email:', userEmail);
      console.log('Session data:', session);

      if (!userEmail) {
        console.error('User email is undefined. Session data:', session);
        return res.status(400).json({ error: 'Invalid session data' });
      }

      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          membership: {
            include: {
              plan: true,
            },
          },
        },
      });

      console.log('User data:', user);

      if (!user || !user.membership) {
        return res.status(200).json({
          hasMembership: false,
          message: 'User does not have an active membership',
        });
      }

      const membership = await prisma.membership.findUnique({
        where: { userEmail },
        select: {
          plan: { select: { name: true } },
          creditsLeft: true,
          endDate: true,
          isActive: true,
        },
      });

      console.log('Membership data:', membership);

      if (!membership) {
        return res.status(404).json({ error: 'No active membership found' });
      }

      if (!membership.endDate) {
        console.error('Membership endDate is null. Membership data:', membership);
        return res.status(500).json({ error: 'Invalid membership data' });
      }

      const daysRemaining = Math.ceil(
        (new Date(membership.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      return res.status(200).json({
        planType: membership.plan?.name ?? '',
        creditsLeft: membership.creditsLeft,
        startDate: '', // Not selected, so leave blank or fetch if needed
        endDate: membership.endDate.toISOString(), // Convert to string
        isActive: membership.isActive,
        daysRemaining,
      });
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}