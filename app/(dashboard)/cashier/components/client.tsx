'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ProductColumn,
  columns,
  dataColumns,
  CashierColumn,
  supplierColumns,
} from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';
import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';
import { Product, Size } from '@prisma/client';
import useCart from '@/hooks/use-supplier-transaction';

interface ProductClientProps {
  data: Product[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [products, setProducts] = useState<CashierColumn[]>([]);

  const carts = useCart((state) => state.carts);
  const removeAll = useCart((state) => state.removeAll);

  const calculateTotal = (products: CashierColumn[]) => {
    let total = 0;
    products.forEach((e) => {
      total += e.subtotal;
    });

    return total;
  };

  return (
    <>
      <div className="flex gap-10">
        <div className="w-1/2">
          <h1> Product List </h1>
          {/* @ts-ignore */}
          <DataTable columns={columns} data={data} searchKey="name" />
        </div>
        <div className="w-full flex-col gap-10">
          <div className="flex items-center justify-between">
            <h1>Carts</h1>
            <div>
              <Button
                onClick={() => {
                  removeAll();
                }}
              >
                {' '}
                <Trash />
              </Button>
            </div>
          </div>
          <div className="w-full">
            <DataTable columns={dataColumns} data={carts} searchKey="name" />
          </div>
          <div className="flex flex-col gap-10">
            <div className="w-full text-right text-lg">
              Total : {formatter.format(Number(calculateTotal(carts)))}
            </div>
            <div className="w-full text-right">
              <Button className="w-full"> Checkout </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
