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
  // change the status from the order to processed
  const prev = await prismadb.order.findFirst({
    where: {
      id: params.orderId,
    },
  });

  if (prev!!.status == 'CANCELED')
    return new NextResponse('ORDER CANNOT BE ALTERED', { status: 402 });

  const order = await prismadb.order.update({
    where: {
      id: params.orderId,
    },
    data: {
      status: 'PAID',
    },
  });

  const log = await prismadb.orderLog.create({
    data: {
      log: 'Order is wait please wait for Admin response',
      order: {
        connect: {
          id: params.orderId,
        },
      },
    },
  });

  return NextResponse.json('PAID');
}
