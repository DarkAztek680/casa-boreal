import { getSession } from 'next-auth/react';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma'; // Assuming prisma is set up in lib/prisma
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  birthdate: z.string().optional(), // Adding birthdate as an optional field
  phone: z.string().optional(),
  preferences: z.object({}).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { email: true, isAdmin: true, createdAt: true, membership: true, name: true, birthdate: true }, // Include name and birthdate
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    }

    if (req.method === 'PUT') {
      const parsedBody = updateUserSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ error: 'Invalid request body', details: parsedBody.error.issues });
      }

      const { name, birthdate, preferences } = parsedBody.data; // Removed phone field

      const updatedUser = await prisma.user.update({
        where: { email: userEmail },
        data: { name, birthdate, preferences }, // Removed phone field
      });

      return res.status(200).json(updatedUser);
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}