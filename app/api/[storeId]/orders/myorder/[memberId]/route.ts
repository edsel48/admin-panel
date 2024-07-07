import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

import { formatter } from '@/lib/utils';
import { format } from 'date-fns';

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
      id: order.id,
      orderItems: formattedItems,
      logs: order.logs,
      total: formatter.format(Number(order.total)),
      totalDiscount: formatter.format(Number(order.totalDiscount)),
      grandTotal: formatter.format(
        Number(order.total) - Number(order.totalDiscount),
      ),
      status: order.status,
      ongkir: formatter.format(Number(order.ongkir)),
      createdAt: format(order.createdAt, 'dd-MM-yyyy'),
    };
  });

  return NextResponse.json(formatted);
}
