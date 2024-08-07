import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { isWithinInterval } from 'date-fns';
import { NextResponse } from 'next/server';
import { format } from 'path';

export async function POST(req: Request) {
  try {
    let body = await req.json();

    let { start, end } = body;

    let products = {};

    let productsData = await prismadb.product.findMany({});

    productsData.forEach((e) => {
      // @ts-ignore
      products[e.id] = [
        {
          subtotal: 0,
          date: new Date(),
        },
      ];
    });

    let orderItems = await prismadb.orderItem.findMany({
      include: {
        product: true,
        order: true,
      },
    });

    orderItems.forEach((item) => {
      if (start == null && end == null) {
        // @ts-ignore
        if (products[item.product.id] == null) {
          // @ts-ignore
          products[item.product.id] = [
            {
              subtotal: Number(item.subtotal),
              date: item.order.createdAt,
            },
          ];
        } else {
          //   @ts-ignore
          products[item.product.id].push({
            subtotal: Number(item.subtotal),
            date: item.order.createdAt,
          });
        }
      } else {
        if (isWithinInterval(item.order.createdAt, { start, end })) {
          // @ts-ignore
          if (products[item.product.id] == null) {
            // @ts-ignore
            products[item.product.id] = [
              {
                subtotal: Number(item.subtotal),
                date: item.order.createdAt,
              },
            ];
          } else {
            //   @ts-ignore
            products[item.product.id].push({
              subtotal: Number(item.subtotal),
              date: item.order.createdAt,
            });
          }
        }
      }
    });

    let keys = Object.keys(products);

    let formatted = [];

    for (const key of keys) {
      // @ts-ignore
      let value = 0;
      // @ts-ignore
      let data = products[key];

      // @ts-ignore
      data.forEach(({ subtotal, date }) => {
        value += Number(subtotal);
      });

      // @ts-ignore
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
        data,
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
