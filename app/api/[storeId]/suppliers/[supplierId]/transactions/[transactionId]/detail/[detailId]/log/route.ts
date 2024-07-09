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

  try {
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

    console.log(detail.quantity);
    console.log(quantity);
    console.log(detail.delivered);
    console.log(quantity + detail.delivered);

    if (Number(detail.quantity) < Number(quantity) + Number(detail.delivered)) {
      return new NextResponse('Please Insert The Required amount', {
        status: 404,
      });
    }

    if (quantity != 0) {
      if (
        Number(detail.quantity) >
        Number(quantity) + Number(detail.delivered)
      ) {
        status = 'Partly Fullfilled';
      }
    }

    let detailUpdated = await prismadb.supplierTransactionItem.update({
      where: {
        id: params.detailId,
      },
      data: {
        delivered: {
          increment: quantity,
        },
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

    try {
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
    } catch (e) {
      return new NextResponse('Error on creating logs', { status: 500 });
    }

    return NextResponse.json(detailUpdated);
  } catch (e) {
    return new NextResponse('Error on updating quantity on detail', {
      status: 500,
    });
  }

  return NextResponse.json('Updated');
}
