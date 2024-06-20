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
import { format, subDays, subMonths, subYears } from 'date-fns';
import { parse } from 'date-fns';
import { subWeeks } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TransactionClient } from './../suppliers/[supplierId]/transactions/[transactionId]/components/client';
import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';

interface TransactionOnSupplierColumn {
  id: string;
  name: string;
  supplierId: string;
  grandTotal: string;
  status: string;
}

export default function PembelianChart() {
  const [transaction, setTransaction] = useState([]);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.get('/api/reports/pembelian');
      let { data } = response;

      setTransaction(data);
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
          <CardTitle>Data Pembelian dengan Supplier</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={transactionOnSupplierColumn}
            // @ts-ignore
            data={transaction}
            searchKey="name"
          />
        </CardContent>
      </Card>
    </>
  );
}
