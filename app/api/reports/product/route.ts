import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { format, isWithinInterval } from 'date-fns';

export async function GET(req: Request) {
  let products = await prismadb.product.findMany({
    include: {
      orderItems: {
        include: {
          order: true,
        },
      },
    },
  });

  //   @ts-ignore
  let formatted = [];

  products.forEach((product) => {
    let orderItems = product.orderItems.map((item) => {
      return {
        quantity: item.quantity,
        orderId: item.orderId,
        size: item.size,
        date: item.order.createdAt,
      };
    });

    formatted.push({
      id: product.id,
      name: product.name,
      orderItems,
    });
  });

  //   @ts-ignore
  return NextResponse.json(formatted);
}
