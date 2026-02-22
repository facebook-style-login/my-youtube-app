export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const apiKeys = await prisma.apiKey.findMany({
            where: {
                userId: userId,
            },
        });
        return NextResponse.json(apiKeys);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while fetching API keys.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
  try {
    const { userId, service, key } = await request.json();

    if (!userId || !service || !key) {
      return NextResponse.json({ error: 'userId, service, and key are required' }, { status: 400 });
    }

    // IMPORTANT: In a real-world application, you should encrypt this key before saving it.
    const newKey = await prisma.apiKey.create({
      data: {
        userId,
        service,
        key,
      },
    });

    return NextResponse.json(newKey, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while creating the API key.' }, { status: 500 });
  }
}

