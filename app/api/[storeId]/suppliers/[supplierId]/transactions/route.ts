import { NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';
import { SizesOnProduct, Product } from '@prisma/client';

interface SupplierProductTransaction {
  product: Product;
  sizeOnProduct: SizesOnProduct;
  data: {
    price: number;
    quantity: number;
    subtotal: number;
  };
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string; supplierId: string } },
) {
  try {
    const body = await req.json();

    const { products, grandTotal } = body;

    const transaction = await prismadb.supplierTransaction.create({
      data: {
        supplierId: params.supplierId,
        grandTotal,
        status: 'ORDER',
        transactionItems: {
          create: products.map((product: SupplierProductTransaction) => ({
            product: {
              connect: {
                id: product.product.id,
              },
            },
            sizesOnProduct: {
              connect: {
                id: product.sizeOnProduct.id,
              },
            },
            quantity: product.data.quantity,
            subtotal: product.data.price * product.data.quantity,
          })),
        },
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error(`[SUPPLIER_TRANSACTION_POST] `, error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
