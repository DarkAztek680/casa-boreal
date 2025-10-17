import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

export interface ClassResponse {
  id: number;
  name: string;
  description: string;
  instructor: string;
  startTime: string;
  endTime: string;
  level: string;
  capacity: number;
  bookedCount: number;
  availableSpots: number;
  status: 'available' | 'full' | 'past';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ClassResponse | ClassResponse[] | { error: string }>) {
  try {
    if (req.method === 'POST') {
      const { name, instructor, level, startTime, endTime, capacity } = req.body;
      if (!name || !instructor || !level || !startTime || !endTime || !capacity) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const newClass = await prisma.class.create({
        data: {
          name,
          instructor,
          level,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          capacity: Number(capacity),
        },
      });

      const transformedClass: ClassResponse = {
        id: newClass.id,
        name: newClass.name,
        description: "", // Add a default or dynamic description
        instructor: newClass.instructor,
        startTime: newClass.startTime.toISOString(),
        endTime: newClass.endTime.toISOString(),
        level: newClass.level,
        capacity: newClass.capacity,
        bookedCount: 0, // Default value for a new class
        availableSpots: newClass.capacity, // All spots are available initially
        status: "available", // Default status for a new class
      };

      return res.status(201).json(transformedClass);
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    const {
      date,
      level,
      instructor,
      startDate,
      endDate,
      includeAll,
    } = req.query;

    const filters: any = {};

    if (date) {
      const parsedDate = new Date(date as string);
      filters.startTime = {
        gte: parsedDate,
        lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    if (level) {
      filters.level = level;
    }

    if (instructor) {
      filters.instructor = {
        contains: instructor as string,
        mode: 'insensitive',
      };
    }

    if (startDate && endDate) {
      filters.startTime = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (!includeAll) {
      filters.startTime = {
        ...filters.startTime,
        gte: new Date(),
      };
    }

    const classes = await prisma.class.findMany({
      where: filters,
      orderBy: { startTime: 'asc' },
      include: {
        bookings: true,
      },
    });

    const response = classes.map((cls: any) => {
      const bookedCount = cls.bookings.length;
      const availableSpots = cls.capacity - bookedCount;
      const status = cls.startTime < new Date()
        ? 'past'
        : availableSpots > 0
        ? 'available'
        : 'full';

      return {
        id: Number(cls.id), // Ensure id is a number
        name: cls.name,
        description: cls.description || "", // Ensure description is included
        instructor: cls.instructor,
        startTime: cls.startTime.toISOString(),
        endTime: cls.endTime.toISOString(),
        level: cls.level,
        capacity: cls.capacity,
        bookedCount,
        availableSpots,
        status: status as 'available' | 'full' | 'past', // Type assertion for status
      };
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}