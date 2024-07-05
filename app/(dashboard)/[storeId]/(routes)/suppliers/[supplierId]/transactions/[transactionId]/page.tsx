'use client';

import { DataTable } from '@/components/ui/data-table';
import {
  Supplier,
  SupplierTransaction,
  SupplierTransactionItem,
} from '@prisma/client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { columns } from './components/columns';
import { TransactionClient } from './components/client';
import { formatter } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DollarSign, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const SupplierTransactionPage = ({
  params,
}: {
  params: { storeId: string; supplierId: string; transactionId: string };
}) => {
  const router = useRouter();

  let [transaction, setTransaction] = useState<SupplierTransaction>();
  let [items, setItems] = useState<SupplierTransactionItem[]>([]);
  let [supplier, setSupplier] = useState<Supplier>();

  useEffect(() => {
    let fetch = async () => {
      // fetch transaction with axios
      let response = await axios.get(
        `/api/${params.storeId}/suppliers/${params.supplierId}/transactions/${params.transactionId}`,
      );

      let transaction = response.data;

      let formattedItems = transaction.transactionItems.map(
        (e: SupplierTransactionItem) => {
          return {
            id: e.id,
            // @ts-ignore
            name: e.product.name,
            // @ts-ignore
            size: e.sizeOnProduct.size.name,
            // @ts-ignore
            price: formatter.format(Number(e.sizeOnProduct.price)),
            subtotal: formatter.format(Number(e.subtotal)),
            quantity: e.quantity,
            status: e.status,
            delivered: e.delivered,
            // @ts-ignore
            supplierTransactionItemMutations:
              // @ts-ignore
              e.supplierTransactionItemMutations,
          };
        },
      );

      setItems(formattedItems);

      // fetch supplier
      let supplierResponse = await axios.get(
        `/api/${params.storeId}/suppliers/${params.supplierId}`,
      );

      let supplier = supplierResponse.data;

      setSupplier(supplier);

      // set transaction here
      setTransaction(transaction);
    };

    fetch();
  }, []);

  const closeOrder = async () => {
    await axios.post(
      `/api/${params.storeId}/suppliers/${params.supplierId}/transactions/${params.transactionId}/close`,
    );

    router.refresh();

    toast.success('Order Closed');
  };

  const paidOrder = async () => {
    await axios.post(
      `/api/${params.storeId}/suppliers/${params.supplierId}/transactions/${params.transactionId}/paid`,
    );

    router.refresh();

    toast.success('Order Paid');
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex-col gap-5">
          <div className="flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex-col gap-5">
                <div className="text-lg font-bold">Supplier Transaction</div>
                <div>{supplier != null ? supplier.name : <></>}</div>
                <div className="text-lg font-bold">
                  Order status :{' '}
                  {transaction != null ? transaction.status : <></>}
                </div>
              </div>
              <div className="flex-col gap-5">
                <div className="text-lg font-bold">
                  {/* Total :{' '}
                  {transaction != null ? (
                    formatter.format(Number(transaction.grandTotal))
                  ) : (
                    <></>
                  )} */}
                </div>
              </div>
            </div>
            {transaction != null ? (
              transaction.status != 'PAID' ? (
                <div className="w-full text-right">
                  {transaction != null ? (
                    transaction.status != 'Completely Fullfilled' ? (
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await closeOrder();

                          router.refresh();
                        }}
                      >
                        <Trash className="mr-3" />
                        Close Order
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          await paidOrder();

                          router.refresh();
                        }}
                      >
                        <DollarSign className="mr-3" />
                        Pay Order
                      </Button>
                    )
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            {/* @ts-ignore */}
            <TransactionClient data={items} />
            {items.map((data) => {
              return (
                <div>
                  {/* @ts-ignore */}
                  {JSON.stringify(data.supplierTransactionItemMutations)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierTransactionPage;
