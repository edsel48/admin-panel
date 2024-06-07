import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { format } from 'path';

export async function GET(req: Request) {
  try {
    let products = {};

    let orderItems = await prismadb.orderItem.findMany({
      include: {
        product: true,
      },
    });

    orderItems.forEach((item) => {
      // @ts-ignore
      if (products[item.product.id] == null) {
        // @ts-ignore
        products[item.product.id] = item.subtotal;
      } else {
        //   @ts-ignore
        products[item.product.id] += item.subtotal;
      }
    });

    let keys = Object.keys(products);

    let formatted = [];

    for (const key of keys) {
      // @ts-ignore
      let value = Number(products[key]);
      let product = await prismadb.product.findFirst({
        where: {
          id: key,
        },
        include: {
          images: true,
        },
      });

      formatted.push({
        value,
        product,
      });
    }

    let sorted = formatted.sort((a, b) => {
      return b.value - a.value;
    });

    return NextResponse.json(sorted);
  } catch (e) {
    console.error(e);

    return new NextResponse('Error', { status: 404 });
  }
}
