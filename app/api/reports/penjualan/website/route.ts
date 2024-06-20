import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { addDays, format, isWithinInterval, subDays } from 'date-fns';

export async function GET(req: Request) {
  try {
    let orders = await prismadb.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });

    let lastWeek = subDays(new Date(), 7);
    let now = addDays(new Date(), 1);

    //   @ts-ignore
    let orderWithinLastWeek = [];

    orders.forEach((order) => {
      if (
        isWithinInterval(order.createdAt, {
          start: lastWeek,
          end: now,
        }) &&
        (order.type == 'STORE' || order.type == '')
      ) {
        orderWithinLastWeek.push(order);
      }
    });

    let count = {};

    //   @ts-ignore
    orderWithinLastWeek.forEach((order) => {
      let date = format(order.createdAt, 'dd MM yyyy');
      // @ts-ignore
      if (count[date] == null) {
        // @ts-ignore
        count[date] = 0;
        // @ts-ignore
        count[date] += Number(order.total);
      } else {
        // @ts-ignore
        count[date] += Number(order.total);
      }
    });
    //   @ts-ignore
    return NextResponse.json(count);
  } catch (e) {
    console.log(e);
  }
}
