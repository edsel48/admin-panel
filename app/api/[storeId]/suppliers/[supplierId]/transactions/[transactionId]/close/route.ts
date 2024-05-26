import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { supplierId: string; transactionId: string } },
) {
  let transaction = await prismadb.supplierTransaction.update({
    where: {
      id: params.transactionId,
    },
    data: {
      status: 'CLOSED',
    },
  });

  // update stock here
  let transactionDetail = await prismadb.supplierTransaction.findFirst({
    where: {
      id: params.transactionId,
    },
    include: {
      transactionItems: {
        include: {
          product: true,
          sizeOnProduct: true,
        },
      },
    },
  });

  if (transactionDetail == null) {
    return new NextResponse('Transaction not found', { status: 404 });
  }

  for (const item of transactionDetail.transactionItems) {
    // updating stock per items
    await prismadb.sizesOnProduct.update({
      where: {
        id: item.sizeOnProduct.id,
      },
      data: {
        stock: {
          increment: item.delivered,
        },
      },
    });
  }

  return NextResponse.json(transaction);
}
