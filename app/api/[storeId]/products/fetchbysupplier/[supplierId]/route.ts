import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { Product, Supplier } from '@prisma/client';

const findBySupplier = (suppliers: Supplier[], supplierId: string) => {
  let valid = false;

  suppliers.forEach((e) => {
    if (e.id == supplierId) {
      valid = true;
    }
  });

  return valid;
};

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; supplierId: string } },
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

  let filtered: Product[] = [];
  products.forEach((product) => {
    let suppliers = product.suppliers;

    // console.log(suppliers);

    suppliers.forEach((supplier) => {
      if (supplier.supplierId == params.supplierId) {
        filtered.push(product);
      }
    });
  });

//   console.log(filtered);

  return NextResponse.json(filtered);
}
