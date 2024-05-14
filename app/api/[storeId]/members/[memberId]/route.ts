import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const { userId } = auth();

    const admins = await prismadb.storeHelper.findMany({
      where: {
        userId: userId!!,
      },
    });

    if (!userId && admins.length == 0) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    let member = await prismadb.member.findUnique({
      where: {
        id: params.memberId,
      },
    });

    return NextResponse.json(member);
  } catch (e) {
    console.log('[MEMBER_GET]', e);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  try {
    const { userId } = auth();

    const admins = await prismadb.storeHelper.findMany({
      where: {
        userId: userId!!,
      },
    });

    if (!userId && admins.length == 0) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.memberId) {
      return new NextResponse('Member id is required', { status: 400 });
    }

    const member = await prismadb.member.delete({
      where: {
        id: params.memberId,
      },
    });

    return NextResponse.json(member);
  } catch (e) {
    console.log('[MEMBER_GET]', e);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string; storeId: string } },
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { name, limit, email, username, password, type } = body;

    if (userId == null) {
      return new NextResponse('User Id Not Found', { status: 401 });
    }

    if (type == 'ADMIN') {
      // will add new person to redirect to the admin pages

      const admin = await prismadb.storeHelper.findFirst({
        where: {
          userId,
        },
      });

      if (!admin) {
        const store = await prismadb.storeHelper.create({
          data: {
            storeId: '815cfb4d-1336-4293-a3bd-86d59abc7a26',
            userId,
          },
        });
      }
    }

    const member = await prismadb.member.update({
      where: {
        id: params.memberId,
      },
      data: {
        name,
        limit,
        email,
        username,
        password,
        type,
      },
    });

    return NextResponse.json(member);
  } catch (e) {
    console.log('[MEMBER_PATCH]', e);
    return new NextResponse('Internal error', { status: 500 });
  }
}
