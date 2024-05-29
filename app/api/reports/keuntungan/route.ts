import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  let orders = await prismadb.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  let allTotal: bigint = BigInt(0);

  orders.forEach((e) => {
    allTotal += e.total;
  });

  let total = Number(allTotal) * (1 - (1 - 0.175));

  return NextResponse.json(total);
}
