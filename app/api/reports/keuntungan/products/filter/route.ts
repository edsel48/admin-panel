import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { isWithinInterval } from 'date-fns';
import { NextResponse } from 'next/server';
import { format } from 'path';

export async function GET(req: Request) {
  try {
    let body = await req.json();

    let { startAt, endAt } = body;

    let products = {};

    let orderItems = await prismadb.orderItem.findMany({
      include: {
        product: true,
        order: true,
      },
    });

    orderItems.forEach((item) => {
      if (
        isWithinInterval(item.order.createdAt, {
          start: startAt,
          end: endAt,
        })
      ) {
        // @ts-ignore
        if (products[item.product.id] == null) {
          // @ts-ignore
          products[item.product.id] = {
            subtotal: item.subtotal,
          };
        } else {
          //   @ts-ignore
          products[item.product.id].subtotal += item.subtotal;
        }
      }
    });

    let keys = Object.keys(products);

    let formatted = [];

    for (const key of keys) {
      // @ts-ignore
      let value = Number(products[key].subtotal);
      // @ts-ignore
      let order = products[key].order;
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

    return new NextResponse('Bad Request', { status: 401 });
  }
}
