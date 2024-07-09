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
      logs: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  let formatted = orders.map((order) => {
    let total = 0;
    let formattedItems = order.orderItems.map((item) => {
      total += Number(item.subtotal) - Number(item.discount);

      return {
        name: item.product.name,
        total: formatter.format(Number(item.subtotal)),
        quantity: item.quantity,
        size: item.size,
        price: formatter.format(
          parseInt(`${Number(item.subtotal)}`) / Number(item.quantity),
        ),
        discount: formatter.format(Number(item.discount)),
        subtotal: formatter.format(
          Number(item.subtotal) - Number(item.discount),
        ),
      };
    });

    return {
      id: order.id,
      orderItems: formattedItems,
      logs: order.logs,
      location: order.address,
      total: formatter.format(Number(total)),
      totalDiscount: formatter.format(Number(order.totalDiscount)),
      grandTotal: formatter.format(Number(total) + Number(order.ongkir)),
      status: order.status,
      ongkir: formatter.format(Number(order.ongkir)),
      createdAt: format(order.createdAt, 'dd-MM-yyyy'),
    };
  });

  return NextResponse.json(formatted);
}
