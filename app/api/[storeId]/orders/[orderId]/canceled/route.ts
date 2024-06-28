import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

import { formatter } from '@/lib/utils';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { orderId: string; storeId: string } },
) {
  // change the status from the order to shipping
  const order = await prismadb.order.update({
    where: {
      id: params.orderId,
    },
    data: {
      status: 'CANCELED',
    },
  });

  const log = await prismadb.orderLog.create({
    data: {
      log: 'Your order is canceled',
      order: {
        connect: {
          id: params.orderId,
        },
      },
    },
  });

  return NextResponse.json("Canceled");
}
