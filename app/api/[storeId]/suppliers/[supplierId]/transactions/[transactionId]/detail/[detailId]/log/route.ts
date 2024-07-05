import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      storeId: string;
      supplierId: string;
      transactionId: string;
      detailId: string;
    };
  },
) {
  let body = await req.json();
  let { quantity } = body;

  let logs = await prismadb.supplierTransactionItemMutation.create({
    data: {
      quantity,
      supplierTransactionItem: {
        connect: {
          id: params.detailId,
        },
      },
    },
  });

  let update = await axios.patch(
    `/api/${params.storeId}/suppliers/${params.supplierId}/transactions/${params.transactionId}/detail/${params.detailId}`,
  );

  return NextResponse.json('Updated');
}
