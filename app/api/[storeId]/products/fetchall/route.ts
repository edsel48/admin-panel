import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  let products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      sizes: {
        include: {
          product: true,
          size: true,
        },
      },
      suppliers: {
        include: {
          supplier: true,
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(products);
}
