'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { formatter } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  format,
  isWithinInterval,
  subDays,
  subMonths,
  subYears,
  parse,
} from 'date-fns';

import { subWeeks } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TransactionClient } from './../suppliers/[supplierId]/transactions/[transactionId]/components/client';
import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Calendar } from '@/components/ui/calendar';

interface TransactionOnSupplierColumn {
  id: string;
  name: string;
  supplierId: string;
  grandTotal: string;
  status: string;
  createdAt: string;
}

export default function PembelianChart() {
  const [transaction, setTransaction] = useState([]);
  const [displayedTransaction, setDisplayedTransaction] = useState([]);

  const [startAt, setStartAt] = useState<Date | undefined>(new Date());
  const [endAt, setEndAt] = useState<Date | undefined>(new Date());

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.get('/api/reports/pembelian');
      let { data } = response;

      setTransaction(data);
      setDisplayedTransaction(data);
    };

    fetch();
  }, []);

  const transactionOnSupplierColumn: ColumnDef<TransactionOnSupplierColumn>[] =
    [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'name',
        header: 'Supplier Name',
      },
      {
        accessorKey: 'grandTotal',
        header: 'Total',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
      },

      {
        id: 'action',
        cell: ({ row }) => (
          <>
            <Button
              onClick={() => {
                router.push(
                  `/${params.storeId}/suppliers/${row.original.supplierId}/transactions/${row.original.id}`,
                );
              }}
            >
              Detail
            </Button>
          </>
        ),
      },
    ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Set Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-5">
            <Card>
              <CardHeader>Start Date</CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  onSelect={setStartAt}
                  selected={startAt}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>End Date</CardHeader>
              <CardContent>
                <Calendar mode="single" onSelect={setEndAt} selected={endAt} />
              </CardContent>
            </Card>
            <Button
              onClick={() => {
                // @ts-ignore
                let data = [];
                transaction.forEach((e) => {
                  if (
                    isWithinInterval(
                      // @ts-ignore
                      parse(e.createdAt, 'dd-MM-yyyy', new Date()),
                      {
                        start: startAt!,
                        end: endAt!,
                      },
                    )
                  ) {
                    data.push(e);
                  }
                });
                // @ts-ignore
                setDisplayedTransaction(data);
              }}
            >
              Set Period
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data Pembelian dengan Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={transactionOnSupplierColumn}
            // @ts-ignore
            data={displayedTransaction}
            searchKey="name"
          />
        </CardContent>
      </Card>
    </>
  );
}
