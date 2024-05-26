'use client';

import prismadb from '@/lib/prismadb';
import { ProductClient } from './components/client';
import { useEffect, useState } from 'react';
import { Product } from '@prisma/client';
import axios from 'axios';

const CashierPage = ({ params }: { params: { storeId: string } }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `/api/${params.storeId}/products/fetchall`,
      );

      let products = response.data;

      setProducts(products);
    };

    fetch();
  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={products} />
      </div>
    </div>
  );
};

export default CashierPage;
