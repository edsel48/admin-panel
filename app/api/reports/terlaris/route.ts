import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  let sizeMap = {
    Piece: 1,
    'Box (10)': 10,
    'Box (5)': 5,
    Lusin: 12,
    Gross: 144,
  };

  let orders = await prismadb.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  let count = {};
  let transactionCount = {};

  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      // @ts-ignore
      let orderCount = sizeMap[item.size] || 0;

      // @ts-ignore
      if (count[item.product.name] == null) {
        // @ts-ignore
        count[item.product.name] = 0;
        // @ts-ignore
        count[item.product.name] += orderCount;
      } else {
        // @ts-ignore
        count[item.product.name] += orderCount;
      }

      // @ts-ignore
      if (transactionCount[item.product.name] == null) {
        // @ts-ignore
        transactionCount[item.product.name] = 0;
        // @ts-ignore
        transactionCount[item.product.name] += 1;
      } else {
        // @ts-ignore
        transactionCount[item.product.name] += 1;
      }
    });
  });

  let sorted = Object.entries(count).sort((a, b) => {
    // @ts-ignore
    return b[1] - a[1];
  });

  return NextResponse.json({ sorted, transactionCount, count });
}
