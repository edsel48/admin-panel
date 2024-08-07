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
      sizes: {
        include: {
          size: true,
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

    let stock = product.sizes
      .map((e) => {
        return Number(e.stock) * Number(e.size.value);
      })
      .reduce((a, b) => a + b, 0);

    formatted.push({
      id: product.id,
      name: product.name,
      orderItems,
      stock,
    });
  });

  //   @ts-ignore
  return NextResponse.json(formatted);
}
