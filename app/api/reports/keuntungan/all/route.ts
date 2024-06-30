import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { Order } from '@prisma/client';
import {
  addMonths,
  addWeeks,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  format,
  parse,
  subMonths,
  subSeconds,
  subYears,
} from 'date-fns';
import {
  addDays,
  addHours,
  differenceInHours,
  isWithinInterval,
  subDays,
  subHours,
  subWeeks,
} from 'date-fns';
import { NextResponse } from 'next/server';

const getOrderDaily = (orders: Order[], range: Date[]) => {
  let output = [];

  output.push(['Hour', 'Total Keuntungan']);

  for (let i = 0; i < range.length - 1; i++) {
    // @ts-ignore
    let hour = format(range[i + 1], 'dd-MM-yyyy HH:ss');
    let total = 0;

    orders.forEach((e) => {
      if (
        isWithinInterval(e.createdAt, {
          start: range[i],
          end: range[i + 1],
        })
      ) {
        // @ts-ignore
        total += Number(e.total);
      }
    });

    output.push([hour, total]);
  }

  return output;
};

const getOrderWeekly = (orders: Order[], range: Date[]) => {
  let output = [];

  output.push(['Days', 'Total Keuntungan']);

  for (let i = 0; i < range.length - 1; i++) {
    // @ts-ignore
    let formatted = format(range[i + 1], 'dd-MM-yyyy');
    let total = 0;

    orders.forEach((e) => {
      if (
        isWithinInterval(e.createdAt, {
          start: range[i],
          end: range[i + 1],
        })
      ) {
        // @ts-ignore
        total += Number(e.total);
      }
    });

    output.push([`${formatted}`, total]);
  }

  return output;
};

const getOrderMonthly = (orders: Order[], range: Date[]) => {
  let output = [];

  output.push(['Weeks', 'Total Pendapatan']);

  for (let i = 0; i < range.length - 1; i++) {
    // @ts-ignore
    let formatted = format(range[i + 1], 'dd-MM-yyyy');
    let total = 0;

    orders.forEach((e) => {
      if (
        isWithinInterval(e.createdAt, {
          start: range[i],
          end: range[i + 1],
        })
      ) {
        // @ts-ignore
        total += Number(e.total);
      }
    });

    output.push([formatted, total]);
  }

  return output;
};

const getOrderAnnually = (orders: Order[], range: Date[]) => {
  let output = [];

  output.push(['Months', 'Total Pendapatan']);

  for (let i = 0; i < range.length - 1; i++) {
    // @ts-ignore
    let formatted = format(range[i + 1], 'dd-MM-yyyy');
    let total = 0;

    orders.forEach((e) => {
      if (
        isWithinInterval(e.createdAt, {
          start: range[i],
          end: range[i + 1],
        })
      ) {
        // @ts-ignore
        total += Number(e.total);
      }
    });

    output.push([formatted, total]);
  }

  return output;
};

const getRange = (dateStart: Date, dateEnd: Date, type: string): Date[] => {
  let output: Date[] = [];

  if (type == 'DAILY') {
    let _dateStart = subHours(
      parse(format(new Date(), 'dd MM yyyy'), 'dd MM yyyy', new Date()),
      2,
    );

    let _dateEnd = addHours(addDays(_dateStart, 1), 2);

    let interval = differenceInHours(_dateEnd, _dateStart);

    let currentDate = _dateStart;

    for (let i = 0; i <= Math.ceil(interval / 2); i++) {
      output.push(currentDate);

      currentDate = addHours(currentDate, 2);
    }

    return output;
  }

  if (type == 'WEEKLY') {
    let _dateStart = subWeeks(
      subDays(
        parse(format(new Date(), 'dd MM yyyy'), 'dd MM yyyy', new Date()),
        1,
      ),
      1,
    );

    let _dateEnd = addDays(_dateStart, 1);

    let interval = 8;

    let currentDate = _dateStart;

    for (let i = 0; i <= interval; i++) {
      output.push(currentDate);

      currentDate = addDays(currentDate, 1);
    }

    console.log(output);

    return output;
  }

  if (type == 'MONTHLY') {
    let _dateStart = subMonths(
      subWeeks(
        parse(format(new Date(), 'dd MM yyyy'), 'dd MM yyyy', new Date()),
        1,
      ),
      1,
    );

    let currentDate = new Date(_dateStart);
    let interval = 5;

    for (let i = 0; i <= interval; i++) {
      output.push(currentDate);

      currentDate = addWeeks(currentDate, 1);
    }

    return output;
  }

  if (type == 'ANNUALLY') {
    let _dateStart = subYears(
      subMonths(
        parse(format(new Date(), 'dd MM yyyy'), 'dd MM yyyy', new Date()),
        1,
      ),
      1,
    );
    let interval = 13;

    let currentDate = new Date(_dateStart);

    for (let i = 0; i <= interval; i++) {
      output.push(currentDate);

      currentDate = addMonths(currentDate, 1);
    }

    console.log(output);

    return output;
  }

  return output;
};

export async function POST(req: Request) {
  let orders = await prismadb.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  let body = await req.json();

  let { type } = body;

  if (type == 'DAILY') {
    let dateStart = subHours(subDays(new Date(), 1), 2);
    let dateEnd = addHours(new Date(), 2);

    // get range from date
    let range = getRange(dateStart, dateEnd, type);

    // getting data queried
    let daily = getOrderDaily(orders, range);

    return NextResponse.json(daily);
  }

  if (type == 'WEEKLY') {
    let dateStart = subDays(subWeeks(new Date(), 1), 1);
    let dateEnd = addDays(new Date(), 1);

    let range = getRange(dateStart, dateEnd, type);

    let weekly = getOrderWeekly(orders, range);

    return NextResponse.json(weekly);
  }

  if (type == 'MONTHLY') {
    let dateStart = subWeeks(subMonths(new Date(), 1), 1);

    let dateEnd = addWeeks(new Date(), 1);

    let range = getRange(dateStart, dateEnd, type);

    let monthly = getOrderMonthly(orders, range);

    return NextResponse.json(monthly);
  }

  if (type == 'ANNUALLY') {
    let dateStart = subMonths(subYears(new Date(), 1), 1);

    let dateEnd = addMonths(new Date(), 1);

    let range = getRange(dateStart, dateEnd, type);

    let annually = getOrderAnnually(orders, range);

    return NextResponse.json(annually);
  }

  return NextResponse.json({ test: 'test' });
}
