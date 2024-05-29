import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { orderId: string } },
) {
  let rating = await prismadb.review.findFirst({
    where: {
      orderId: params.orderId,
    },
  });

  if (rating == null) {
    return NextResponse.json(null);
  }

  return NextResponse.json(rating);
}
