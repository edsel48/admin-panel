import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { addDays, format, isWithinInterval, subDays } from 'date-fns';

export async function GET(req: Request) {
  let products = await prismadb.product.findMany({
    include: {
      sizes: {
        include: {
          size: true,
        },
      },
    },
  });
  return NextResponse.json(products);
}
