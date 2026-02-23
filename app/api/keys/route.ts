
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all keys
export async function GET() {
    try {
        const keys = await prisma.apiKey.findMany({
            orderBy: {
                createdAt: 'asc',
            }
        });
        return NextResponse.json(keys);
    } catch (error) {
        console.error("Error fetching keys:", error);
        return NextResponse.json({ error: "Failed to fetch API keys." }, { status: 500 });
    }
}

// POST a new key
export async function POST(request: Request) {
    try {
        const { key, service } = await request.json();
        if (!key || typeof key !== 'string' || !service || typeof service !== 'string') {
            return NextResponse.json({ error: 'Invalid API key or service provided.' }, { status: 400 });
        }

        // Check if the key already exists
        const existingKey = await prisma.apiKey.findUnique({ where: { key } });
        if (existingKey) {
            return NextResponse.json({ error: 'API key already exists.' }, { status: 409 });
        }

        const newKey = await prisma.apiKey.create({
            data: { key, service },
        });
        return NextResponse.json(newKey, { status: 201 });
    } catch (error) {
        console.error("Error saving key:", error);
        return NextResponse.json({ error: "Failed to save API key." }, { status: 500 });
    }
}

// DELETE a key
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'Invalid ID provided.' }, { status: 400 });
        }

        await prisma.apiKey.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'API key deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error("Error deleting key:", error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: 'API key not found.' }, { status: 404 });
        }
        return NextResponse.json({ error: "Failed to delete API key." }, { status: 500 });
    }
}
