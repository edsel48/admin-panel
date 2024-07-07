import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { addDays, format, isWithinInterval, subDays } from 'date-fns';

export async function GET(req: Request) {
  try {
    let orders = await prismadb.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      where: {
        type: 'STORE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(
      orders.map((e) => {
        return {
          id: e.id,
          total: Number(e.total),
          createdAt: e.createdAt,
          status: e.status,
          discount: Number(e.totalDiscount),
        };
      }),
    );
  } catch (e) {}
}
