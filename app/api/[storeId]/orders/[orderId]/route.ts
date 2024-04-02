import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string; storeId: string } },
) {
  const { userId } = auth();

  const body = await req.json();

  const { isPaid } = body;

  if (!userId) {
    return new NextResponse('Unauthenticated', { status: 403 });
  }

  if (!params.orderId) {
    return new NextResponse('Order id is required', { status: 400 });
  }

  try {
    const order = await prismadb.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        isPaid,
      },
    });

    console.log(order);

    return NextResponse.json(
      { order },
      {
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.log('[ORDERS_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
