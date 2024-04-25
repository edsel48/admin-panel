import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, limit, email, username, password } = body;

    if (!name) {
      return new NextResponse('Name is Required', { status: 400 });
    }

    const member = prismadb.member.create({
      data: {
        name,
        limit,
        email,
        username,
        password,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.log('[MEMBERS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
