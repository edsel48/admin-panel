import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import {
  isWithinInterval,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { parse, format } from 'date-fns';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { type: string } },
) {
  let orders = await prismadb.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  let allTotal: bigint = BigInt(0);

  //   @ts-ignore
  let filtered = [];

  let dateStart = subYears(new Date(), 1);
  let dateEnd = new Date();

  if (params.type == 'DAILY') dateStart = subDays(new Date(), 1);
  if (params.type == 'WEEKLY') dateStart = subWeeks(new Date(), 1);
  if (params.type == 'MONTHLY') dateStart = subMonths(new Date(), 1);

  orders.forEach((order) => {
    if (
      isWithinInterval(order.createdAt, {
        start: dateStart,
        end: dateEnd,
      })
    ) {
      filtered.push(order);
    }
  });

  //   @ts-ignore
  //   console.log(filtered);

  //   @ts-ignore
  filtered.forEach((order) => {
    allTotal += order.total;
  });

  let total = Number(allTotal) * (1 - (1 - 0.175));

  return NextResponse.json(total);
}
