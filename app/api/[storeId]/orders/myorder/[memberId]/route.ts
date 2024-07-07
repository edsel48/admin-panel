import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

import { formatter } from '@/lib/utils';

export async function GET(
  req: Request,
  { params }: { params: { memberId: string } },
) {
  const orders = await prismadb.order.findMany({
    where: {
      memberId: params.memberId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      logs: true,
    },
  });

  let formatted = orders.map((order) => {
    return {
      ...order,
      total: Number(order.total),
      totalDiscount: Number(order.totalDiscount),
    };
  });

  return NextResponse.json(formatted);
}
