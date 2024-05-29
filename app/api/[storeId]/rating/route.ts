import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request,
  { params }: { params: { orderId: string } },
) {
  let body = await req.json();

  let { orderId, review, starRating } = body;

  let rating = await prismadb.review.create({
    data: {
      orderId,
      review,
      starRating,
    },
  });

  return NextResponse.json(rating);
}
