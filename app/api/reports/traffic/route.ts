import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import { format } from 'date-fns/format';

export async function GET(req: Request) {
  let traffics = await prismadb.traffic.findMany({});

  let days = {};

  traffics.forEach((traffic) => {
    let date: string = format(traffic.date, 'dd MM yyyy');

    // @ts-ignore
    if (days[date] == null) {
      // @ts-ignore
      days[date] = [];
      // @ts-ignore
      days[date].push(traffic);
    } else {
      // @ts-ignore
      days[date].push(traffic);
    }
  });

  return NextResponse.json(days);
}

export async function POST(req: Request) {
  let body = await req.json();

  let { ip } = body;

  if (ip == null) {
    return new NextResponse('Error ip not found', { status: 404 });
  }

  let traffic = await prismadb.traffic.create({
    data: {
      ip,
    },
  });

  return NextResponse.json(traffic);
}
