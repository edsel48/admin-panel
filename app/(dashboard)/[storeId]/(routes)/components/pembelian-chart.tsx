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

import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

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
          <div className="flex items-center gap-5">
            <Card>
              <CardHeader>Start Date</CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !startAt && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startAt ? (
                        format(startAt, 'PPP')
                      ) : (
                        <span>Pick start date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startAt}
                      onSelect={setStartAt}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>End Date</CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !endAt && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endAt ? (
                        format(endAt, 'PPP')
                      ) : (
                        <span>Pick end date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endAt}
                      onSelect={setEndAt}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
            searchKey="status"
            list={[
              'ALL',
              'ORDERED',
              'PAID',
              'Partly Fullfilled',
              'CLOSED',
              'Completely Fullfilled',
            ]}
          />
        </CardContent>
      </Card>
    </>
  );
}
