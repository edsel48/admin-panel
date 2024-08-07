import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { addDays, format, isWithinInterval, subDays } from 'date-fns';
import { formatter } from '@/lib/utils';

export async function GET(req: Request) {
  let transactions = await prismadb.supplierTransaction.findMany({
    include: {
      supplier: true,
      transactionItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  //   interface TransactionOnSupplierColumn {
  //     id: string;
  //     name: string;
  //     supplierId: string;
  //     grandTotal: string;
  //     status: string;
  //   }

  let formatted = transactions.map((t) => {
    return {
      id: t.id,
      supplierId: t.supplierId,
      name: t.supplier.name,
      grandTotal: formatter.format(Number(t.grandTotal)),
      total: Number(t.grandTotal),
      status: t.status,
      createdAt: format(t.createdAt, 'dd-MM-yyyy'),
    };
  });

  return NextResponse.json(formatted);
}
