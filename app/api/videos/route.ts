
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
        const videos = await prisma.video.findMany({
            where: {
                userId: userId,
            },
        });
        return NextResponse.json(videos);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while fetching videos.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId, url, title, channel, views, likes, earnings } = await request.json();

        if (!userId || !url || !title || !channel || !views || !likes) {
            return NextResponse.json({ error: 'Incomplete video data' }, { status: 400 });
        }

        const newVideo = await prisma.video.create({
            data: {
                userId,
                url,
                title,
                channel,
                views: parseInt(views, 10),
                likes: parseInt(likes, 10),
                earnings: earnings ? parseFloat(earnings) : null,
            },
        });

        return NextResponse.json(newVideo, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while creating the video.' }, { status: 500 });
    }
}
