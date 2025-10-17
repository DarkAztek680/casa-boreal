import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, captchaToken } = await req.json();

    // Validate CAPTCHA token (optional, depending on your setup)
    if (!captchaToken) {
      return NextResponse.json({ error: 'CAPTCHA no válido.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe.' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'CLIENTE', // Rol predeterminado
      },
    });

    return NextResponse.json({ message: 'Usuario creado exitosamente.', user: newUser });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}