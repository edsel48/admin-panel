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
    let formattedItems = order.orderItems.map((item) => {
      return {
        name: item.product.name,
        subtotal: formatter.format(Number(item.subtotal)),
        quantity: item.quantity,
        size: item.size,
        price: formatter.format(
          parseInt(`${Number(item.subtotal)}`) / Number(item.quantity),
        ),
      };
    });
    return {
      orderItems: formattedItems,
      logs: order.logs,
      total: Number(order.total).toString(),
      totalDiscount: Number(order.totalDiscount).toString(),
      status: order.status,
      ongkir: Number(order.ongkir).toString(),
    };
  });

  return NextResponse.json(formatted);
}
