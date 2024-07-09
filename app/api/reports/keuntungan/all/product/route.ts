import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  let products = await prismadb.product.findMany({});

  return NextResponse.json(products);
}
