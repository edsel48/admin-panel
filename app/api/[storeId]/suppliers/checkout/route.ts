import prismadb from '@/lib/prismadb';
import { Product } from '@prisma/client';
import { NextResponse } from 'next/server';

interface CashierColumn {
  name: string;
  size: string;
  price: number;
  qty: number;
  subtotal: number;
}

const getSize = (product: Product, sizeName: string) => {
  let size = null;

  // @ts-ignore
  product.sizes.forEach((e) => {
    if (e.size.name == sizeName) {
      size = e;
    }
  });

  return size;
};

const getProductDetail = async (productName: string, sizeName: string) => {
  const product = await prismadb.product.findFirst({
    where: {
      name: productName,
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
  });

  // @ts-ignore
  const size = getSize(product, sizeName);

  return {
    product,
    size,
  };
};

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  let body = await req.json();
  let { carts, supplierId }: { carts: CashierColumn[]; supplierId: string } =
    body;

  let fullData = [];
  let grandTotal = 0;

  for (const cart of carts) {
    let data = await getProductDetail(cart.name, cart.size);
    // @ts-ignore
    data.quantity = Number(cart.qty);
    // @ts-ignore
    data.subtotal = Number(cart.subtotal);

    grandTotal += cart.subtotal;

    fullData.push(data);
  }

  const transaction = await prismadb.supplierTransaction.create({
    data: {
      supplierId: supplierId,
      grandTotal,
      status: 'ORDERED',
      transactionItems: {
        create: fullData.map((cart) =>
          cart != null
            ? {
                product: {
                  connect: {
                    // @ts-ignore
                    id: cart.product.id,
                  },
                },
                sizeOnProduct: {
                  connect: {
                    // @ts-ignore
                    id: cart.size.id,
                  },
                },
                // @ts-ignore
                quantity: cart.quantity,
                // @ts-ignore
                subtotal: cart.subtotal,
              }
            : {
                product: {
                  connect: {
                    // @ts-ignore
                    id: '-',
                  },
                },
                sizeOnProduct: {
                  connect: {
                    // @ts-ignore
                    id: '-',
                  },
                },
                // @ts-ignore
                quantity: 0,
                // @ts-ignore
                subtotal: 0,
              },
        ),
      },
    },
  });

  return NextResponse.json({ fullData, id: transaction.id });
}
