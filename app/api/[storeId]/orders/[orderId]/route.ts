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

export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string; storeId: string } },
) {
  const { userId } = auth();

  const body = await req.json();

  const { isPaid } = body;

  const admins = await prismadb.storeHelper.findMany({
    where: {
      userId: userId!!,
    },
  });

  if (!userId && admins.length == 0) {
    return new NextResponse('Unauthenticated', { status: 401 });
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

export async function GET(
  req: Request,
  { params }: { params: { orderId: string; storeId: string } },
) {
  let order = await prismadb.order.findFirst({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
      member: true,
      logs: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  // @ts-ignore
  let formattedItems = [];

  if (order == null) {
    return new NextResponse('Order not found', { status: 404 });
  }

  let shippingCost = order.total;

  let total = 0;

  order.orderItems.forEach((item) => {
    shippingCost -= item.subtotal;

    formattedItems.push({
      name: item.product.name,
      subtotal: formatter.format(Number(item.subtotal)),
      quantity: item.quantity,
      size: item.size,
      price: formatter.format(
        parseInt(`${Number(item.subtotal)}`) / Number(item.quantity),
      ),
      total: formatter.format(Number(item.subtotal) - Number(item.discount)),
      discount: formatter.format(Number(item.discount)),
    });

    total += Number(item.subtotal) - Number(item.discount);
  });

  let formatted = {
    total: Number(total + order.ongkir),
    type: order.type,
    member: order.member == null ? 'Anon' : order.member.name,
    // @ts-ignore
    orderItems: formattedItems,
    shippingCost: Number(order.ongkir),
    address: order.address,
    status: order.status,
    logs: order.logs,
  };

  return NextResponse.json(formatted);
}
