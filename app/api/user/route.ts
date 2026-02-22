export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred while fetching users.' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { email, name } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
            },
        });

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error(error);
        // Check for unique constraint violation in a type-safe way
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return NextResponse.json({ error: 'A user with this email already exists.' }, { status: 409 });
            }
        }
        return NextResponse.json({ error: 'An error occurred while creating the user.' }, { status: 500 });
    }
}
