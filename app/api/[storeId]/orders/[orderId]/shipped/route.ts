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
  const prev = await prismadb.order.findFirst({
    where: {
      id: params.orderId,
    },
  });

  let body = await req.json();

  let { orderTrackingId } = body;

  if (prev!!.status == 'CANCELED')
    return new NextResponse('ORDER CANNOT BE ALTERED', { status: 402 });

  const order = await prismadb.order.update({
    where: {
      id: params.orderId,
    },
    data: {
      status: 'SHIPPING',
    },
  });

  const log = await prismadb.orderLog.create({
    data: {
      log: `Your order is shipped [ CODE : ${orderTrackingId} ]`,
      order: {
        connect: {
          id: params.orderId,
        },
      },
      orderTrackingId,
    },
  });

  let orderData = await prismadb.orderItem.findMany({
    where: {
      orderId: params.orderId,
    },
    include: {
      product: {
        include: {
          sizes: {
            include: {
              size: true,
            },
          },
        },
      },
    },
  });

  for (const item of orderData) {
    try {
      let size = await prismadb.sizesOnProduct.findFirstOrThrow({
        where: {
          productId: item.productId,
          size: {
            name: item.size,
          },
        },
      });

      await prismadb.sizesOnProduct.update({
        where: {
          id: size.id,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    } catch (e) {
      return new NextResponse('Update failed', { status: 500 });
    }
  }

  return NextResponse.json('Shipped');
}
