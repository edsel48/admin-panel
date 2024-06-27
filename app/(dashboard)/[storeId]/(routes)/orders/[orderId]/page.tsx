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
import { DollarSign, Star, StarOff, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const RepeatStar = (x: number) => {
  let arr = [];
  for (let i = 0; i < x; i++) {
    arr.push(i);
  }
  return arr.map((e) => <Star />);
};

const OrderTransactionPage = ({
  params,
}: {
  params: { storeId: string; supplierId: string; orderId: string };
}) => {
  const router = useRouter();

  let [transaction, setTransaction] = useState<SupplierTransaction>();
  let [items, setItems] = useState<SupplierTransactionItem[]>([]);
  let [shipping, setShipping] = useState(0);

  let [rating, setRating] = useState({});

  let [supplier, setSupplier] = useState<Supplier>();

  useEffect(() => {
    let fetch = async () => {
      // fetch transaction with axios
      let response = await axios.get(
        `/api/${params.storeId}/orders/${params.orderId}`,
      );

      let ratingResponse = await axios.get(
        `/api/${params.storeId}/rating/${params.orderId}`,
      );

      let rating = ratingResponse.data;

      let transaction = response.data;

      setRating(rating);

      setTransaction(transaction);
      setShipping(transaction.shippingCost);
      setItems(transaction.orderItems);
    };

    fetch();
  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex-col gap-5">
          <div className="flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex-col gap-5">
                <div className="text-lg font-bold">Transaction</div>
                {/* @ts-ignore */}
                <div>
                  {transaction == null ? (
                    <></>
                  ) : // @ts-ignore
                  transaction.member != null ? (
                    // @ts-ignore
                    `Member : ${transaction.member}`
                  ) : (
                    ''
                  )}
                </div>
                {transaction != null ? (
                  // @ts-ignore
                  <div>Shipping Address : {transaction.address}</div>
                ) : (
                  <></>
                )}
                {/* <div>{supplier != null ? supplier.name : <></>}</div> */}
                <div className="text-lg font-bold">
                  {transaction != null ? <>{transaction.status}</> : <></>}
                </div>
              </div>
              <div className="flex-col gap-5">
                <div className="text-lg font-bold">
                  <div>
                    Total :{' '}
                    {transaction != null ? (
                      // @ts-ignore
                      formatter.format(Number(transaction.total))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
                <div>
                  Shipping Cost :{' '}
                  {transaction != null ? (
                    // @ts-ignore
                    formatter.format(Number(transaction.shippingCost))
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>
            {/* @ts-ignore */}
            <TransactionClient data={items} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTransactionPage;
