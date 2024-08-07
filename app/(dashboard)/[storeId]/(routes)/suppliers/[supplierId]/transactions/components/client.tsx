'use client';

import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import useTransaction from '@/hooks/use-transaction';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import CellAction from './cell-action';

interface ProductClientProps {
  data: Product[];
}

export const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [productData, setProductData] = useState<Product[]>([]);

  const [products, setProducts] = useState<CashierColumn[]>([]);
  const [status, setStatus] = useState<string>('CHECKOUT');

  const [transactionId, setTransactionId] = useState<string>('');

  const carts = useTransaction((state) => state.carts);
  const removeAll = useTransaction((state) => state.removeAll);

  const calculateTotal = (products: CashierColumn[]) => {
    let total = 0;
    products.forEach((e) => {
      total += e.subtotal;
    });

    return total;
  };

  const [price, setPrice] = useState<number>(calculateTotal(carts));

  const checkout = async () => {
    if (status == 'PAYMENT') {
      setStatus('CHECKOUT');
      removeAll();
      toast.success('Checkout Successful');
    } else if (status == 'CHECKOUT') {
      try {
        let response = await axios.post(
          `/api/${params.storeId}/suppliers/checkout`,
          { carts, supplierId: params.supplierId },
        );

        let data = response.data;

        setTransactionId(data.id);

        removeAll();

        toast.success('Order Created');

        router.push(
          `/${params.storeId}/suppliers/${params.supplierId}/transactions/${data.id}`,
        );
      } catch (e) {
        // @ts-ignore
        toast.error(`Checkout failed, ${e.response.data.error}`);
      }
    }
  };

  return (
    <Suspense fallback={<>Loading</>}>
      <div className="flex gap-10">
        <div className="w-1/2">
          <h1> Product List </h1>
          {/* @ts-ignore */}
          <DataTable columns={columns} data={data} searchKey="name" list={[]} />
          {/* {
            <div className="flex flex-col gap-5">
              {data.map((e) => (
                <div className="flex gap-3">
                  <div>{e.name}</div>
                </div>
              ))}
            </div>
          } */}
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
              <Button
                className="w-full"
                onClick={async () => {
                  setPrice(calculateTotal(carts));
                  await checkout();
                }}
              >
                {' '}
                Create Order{' '}
              </Button>
              <Dialog>
                <DialogTrigger asChild></DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {status == 'CHECKOUT' ? 'Payments' : 'Change'}
                    </DialogTitle>
                    <DialogDescription>
                      {status == 'CHECKOUT' ? 'Input Payment Info' : ''}
                    </DialogDescription>
                  </DialogHeader>
                  {status == 'CHECKOUT' ? (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="payment" className="text-right">
                          Payment
                        </Label>
                        <Input
                          id="payment"
                          type="number"
                          value={`${price}`}
                          className="col-span-3"
                          onChange={(e) => {
                            setPrice(Number(e.currentTarget.value));
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-col gap-5">
                      <div>
                        {formatter.format(price - calculateTotal(carts))}
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <div className="w-full flex-col gap-3">
                      {status == 'CHECKOUT' ? (
                        <div className="text-lg">{formatter.format(price)}</div>
                      ) : (
                        <></>
                      )}

                      {status == 'CHECKOUT' ? (
                        <Button
                          className="w-full"
                          onClick={async () => {
                            await checkout();
                          }}
                          type="submit"
                        >
                          {status == 'CHECKOUT' ? 'Pay' : 'Finish'}
                        </Button>
                      ) : (
                        <DialogClose asChild>
                          <Button
                            onClick={async () => {
                              await checkout();
                            }}
                            className="w-full"
                            type="button"
                            variant="secondary"
                          >
                            Close
                          </Button>
                        </DialogClose>
                      )}
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};
