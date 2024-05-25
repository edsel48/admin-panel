'use server';

import prismadb from '@/lib/prismadb';
import { ProductClient } from './components/client';
import { Suspense } from 'react';

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
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

  return (
    <Suspense fallback={<>Loading</>}>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <ProductClient data={products} />
        </div>
      </div>
    </Suspense>
  );
};

export default ProductsPage;
