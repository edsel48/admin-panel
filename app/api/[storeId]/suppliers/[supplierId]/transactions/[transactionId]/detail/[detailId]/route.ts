import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { supplierId: string; transactionId: string; detailId: string };
  },
) {
  let body = await req.json();
  let { quantity } = body;

  let transaction = await prismadb.supplierTransaction.findFirst({
    where: {
      id: params.transactionId,
    },
  });

  if (transaction == null)
    return new NextResponse('Transaction not Found', { status: 404 });

  if (transaction.status == 'CLOSED')
    return new NextResponse('Transaction is closed', { status: 404 });

  let detail = await prismadb.supplierTransactionItem.findFirst({
    where: {
      id: params.detailId,
    },
  });

  if (detail == null)
    return new NextResponse('Detail not Found', { status: 404 });

  let status = 'Completely Fullfilled';

  if (quantity != 0) {
    if (quantity < detail.quantity) {
      status = 'Partly Fullfilled';
    }
  }

  let detailUpdated = await prismadb.supplierTransactionItem.update({
    where: {
      id: params.detailId,
    },
    data: {
      delivered: quantity,
      status,
    },
  });

  // after update check on all the transactions
  let transactionAfterUpdate = await prismadb.supplierTransaction.findFirst({
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

  if (transactionAfterUpdate == null)
    return new NextResponse('Transaction not Found', { status: 404 });

  let transactionStatus = 'Completely Fullfilled';
  transactionAfterUpdate.transactionItems.forEach((e) => {
    if (e.status != 'Completely Fullfilled') {
      console.log(e);
      transactionStatus = 'Partly Fullfilled';
    }
  });

  await prismadb.supplierTransaction.update({
    where: {
      id: params.transactionId,
    },
    data: {
      status: transactionStatus,
    },
  });

  return NextResponse.json(detailUpdated);
}
