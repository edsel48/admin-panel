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
      status: 'PAID',
    },
  });

  return NextResponse.json(transaction);
}
