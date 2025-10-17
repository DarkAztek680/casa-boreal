# Casa Boreal - Class Management System

A Next.js application for managing yoga and pilates classes at Casa Boreal, featuring class scheduling, booking system, and admin panel.

## Features

- **Weekly Class Calendar**: View classes in a weekly format (Monday-Sunday)
- **Class Booking**: Reserve classes with credit system
- **Admin Panel**: Create and manage classes, users, and memberships
- **User Authentication**: Secure login with NextAuth
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Live class availability and booking status

## Tech Stack

- **Framework**: Next.js 15.5.4 with App Router
- **Database**: Prisma ORM with SQLite
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with custom Casa Boreal colors
- **Animations**: Framer Motion
- **Date Handling**: date-fns
- **State Management**: SWR for data fetching

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3001](http://localhost:3001)** in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `app/` - Next.js app router pages
- `components/` - Reusable React components
- `pages/api/` - API routes
- `prisma/` - Database schema and migrations
- `lib/` - Utility functions and configurations
- `types/` - TypeScript type definitions

## Environment Variables

Create a `.env.local` file with:

```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001
DATABASE_URL="file:./dev.db"
```

## Database Schema

The application uses Prisma with the following main models:
- **User**: User accounts with authentication
- **Class**: Yoga/pilates classes with instructor, level, capacity
- **Booking**: Class reservations with credit system
- **Membership**: User membership plans
- **Plan**: Available membership plans

## Deployment

The application can be deployed to Vercel or any Node.js hosting platform. Make sure to set the environment variables in your deployment platform.
