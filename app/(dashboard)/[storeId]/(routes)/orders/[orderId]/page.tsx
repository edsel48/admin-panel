'use client';

import { DataTable } from '@/components/ui/data-table';
import {
  Order,
  Supplier,
  SupplierTransaction,
  SupplierTransactionItem,
} from '@prisma/client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import axios from 'axios';
import { useState, useEffect } from 'react';
import { columns } from './components/columns';
import { TransactionClient } from './components/client';
import { formatter } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DollarSign, Star, StarOff, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Router from 'next/router';
import { Separator } from '@/components/ui/separator';
import { format, isBefore } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CancelButton = ({
  params,
}: {
  params: {
    storeId: string;
    supplierId: string;
    orderId: string;
  };
}) => {
  return (
    <Button
      variant={'destructive'}
      onClick={async () => {
        await axios.post(
          `/api/${params.storeId}/orders/${params.orderId}/canceled`,
        );

        toast.success('Order Canceled');

        window.location.reload();
      }}
    >
      {' '}
      Cancel{' '}
    </Button>
  );
};

const FinishedButton = ({
  params,
}: {
  params: {
    storeId: string;
    supplierId: string;
    orderId: string;
  };
}) => {
  return (
    <Button
      onClick={async () => {
        await axios.post(
          `/api/${params.storeId}/orders/${params.orderId}/finished`,
        );

        toast.success('Order is now finished');

        window.location.reload();
      }}
    >
      {' '}
      Finish{' '}
    </Button>
  );
};

const ProcessedButton = ({
  params,
}: {
  params: {
    storeId: string;
    supplierId: string;
    orderId: string;
  };
}) => {
  return (
    <Button
      onClick={async () => {
        await axios.post(
          `/api/${params.storeId}/orders/${params.orderId}/processed`,
        );

        toast.success('Order is now Processed');

        window.location.reload();
      }}
    >
      {' '}
      Process{' '}
    </Button>
  );
};

const ShippedButton = ({
  params,
  orderTrackingId,
}: {
  params: {
    storeId: string;
    supplierId: string;
    orderId: string;
  };
  orderTrackingId: string;
}) => {
  return (
    <Button
      onClick={async () => {
        await axios.post(
          `/api/${params.storeId}/orders/${params.orderId}/shipped`,
          {
            orderTrackingId,
          },
        );

        toast.success('Order is now Shipped');

        window.location.reload();
      }}
    >
      {' '}
      Ship{' '}
    </Button>
  );
};

const GenerateInvoiceButton = ({
  params,
}: {
  params: {
    storeId: string;
    supplierId: string;
    orderId: string;
  };
}) => {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        window.open(
          `https://admin.mitra-solusi.shop/transaction/${params.orderId}/invoice`,
        );
      }}
    >
      Generate Invoice
    </Button>
  );
};

const StatusButton = ({
  params,
  status,
  setInput,
  orderTrackingId,
}: {
  params: {
    storeId: string;
    supplierId: string;
    orderId: string;
  };
  status: string | undefined;
  setInput: void;
  orderTrackingId: string;
}) => {
  if (status == undefined) return <>status not found</>;

  let statuses = {
    PROCESSED: (
      <div className="flex-col gap-3">
        <Label> Shipping Code </Label>
        <Input
          onBlur={(e) => {
            // @ts-ignore
            setInput(e.currentTarget.value);
          }}
        />
        <div className="mt-3 flex gap-3">
          {' '}
          <ShippedButton
            params={params}
            orderTrackingId={orderTrackingId}
          />{' '}
          <CancelButton params={params} />{' '}
          <GenerateInvoiceButton params={params} />
        </div>
      </div>
    ),
    PAID: (
      <div className="flex gap-3">
        {' '}
        <ProcessedButton params={params} /> <CancelButton params={params} />{' '}
        <GenerateInvoiceButton params={params} />
      </div>
    ),
    SHIPPING: (
      <div className="flex gap-3">
        {' '}
        <CancelButton params={params} />{' '}
        <GenerateInvoiceButton params={params} />
      </div>
    ),
    CANCELLED: <></>,
    FINISHED: <></>,
  };

  // @ts-ignore
  return statuses[status];
};

const OrderTransactionPage = ({
  params,
}: {
  params: { storeId: string; supplierId: string; orderId: string };
}) => {
  const router = useRouter();

  let [transaction, setTransaction] = useState();
  let [items, setItems] = useState<SupplierTransactionItem[]>([]);
  let [trackingId, setTrackingId] = useState<string>('');

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
                  Transaction Status : {/* @ts-ignore */}
                  {transaction != null ? <>{transaction.status}</> : <></>}
                </div>
                <div className="mt-3">
                  {/* @ts-ignore */}
                  <StatusButton
                    params={params}
                    // @ts-ignore
                    status={transaction?.status}
                    // @ts-ignore
                    setInput={setTrackingId}
                    orderTrackingId={trackingId}
                  />
                </div>
              </div>
              <div className="flex-col gap-5 text-right">
                <div className="text-lg font-bold">
                  <div>
                    Total :{' '}
                    {transaction != null ? (
                      formatter.format(
                        // @ts-ignore
                        Number(transaction.total - transaction.shippingCost),
                      )
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
                <div className="text-lg font-bold">
                  <div>
                    Grand Total :{' '}
                    {transaction != null ? (
                      // @ts-ignore
                      formatter.format(Number(transaction.total))
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* @ts-ignore */}
            <TransactionClient data={items} />
          </div>
          <Separator />
          <div className="mt-3 text-lg font-bold">Order Logs</div>
          <div className="mt-3 flex-col gap-3">
            {transaction != null ? (
              // @ts-ignore
              transaction.logs != null &&
              // @ts-ignore
              transaction.logs
                // @ts-ignore
                .map((e) => {
                  return (
                    <div className="mt-3">
                      <Card>
                        <CardHeader>
                          <CardTitle>{e.log}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription>
                            Date : {format(e.createdAt, 'dd-MM-yyyy HH:mm')}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTransactionPage;
