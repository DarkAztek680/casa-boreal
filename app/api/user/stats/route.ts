import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: Request) {
  return new Response('GET response for stats');
}

export async function POST(req: Request) {
  return new Response('POST response for stats');
}