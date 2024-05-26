'use client';

import prismadb from '@/lib/prismadb';
import { ProductClient } from './components/client';
import { useEffect, useState } from 'react';
import { Product, Supplier } from '@prisma/client';
import axios from 'axios';

const CashierPage = ({
  params,
}: {
  params: { storeId: string; supplierId: string };
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [supplier, setSupplier] = useState<Supplier>();

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get(
        `/api/${params.storeId}/products/fetchbysupplier/${params.supplierId}`,
      );

      const supplierResponse = await axios.get(
        `/api/${params.storeId}/suppliers/${params.supplierId}`,
      );

      let products = response.data;
      let supplier = supplierResponse.data;

      setProducts(products);
      setSupplier(supplier);
    };

    fetch();
  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex-col gap-3">
          <div className="text-lg font-bold">Supplier Transaction</div>
          {supplier != null ? <div> {supplier.name}</div> : <></>}
        </div>
        <ProductClient data={products} />
      </div>
    </div>
  );
};

export default CashierPage;
