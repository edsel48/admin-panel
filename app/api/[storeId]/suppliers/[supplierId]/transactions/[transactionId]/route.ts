import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { supplierId: string; transactionId: string } },
) {
  let transaction = await prismadb.supplierTransaction.findFirst({
    where: {
      id: params.transactionId,
    },
    include: {
      transactionItems: {
        include: {
          product: true,
          sizeOnProduct: {
            include: {
              size: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(transaction);
}
