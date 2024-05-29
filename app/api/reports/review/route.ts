import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import subDays from 'date-fns/subDays';
import { format, isWithinInterval } from 'date-fns';

export async function GET(req: Request) {
  let reviews = await prismadb.review.findMany({});
  let total = 0;

  reviews.forEach((e) => {
    total += e.starRating;
  });

  let average = total / reviews.length;

  return NextResponse.json(Math.ceil(average));
}
