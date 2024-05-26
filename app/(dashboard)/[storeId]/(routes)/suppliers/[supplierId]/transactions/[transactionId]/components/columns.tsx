'use client';

import { ColumnDef } from '@tanstack/react-table';

import CellAction from './cell-action';

import { Button } from '@/components/ui/button';
import { Product, Size, SizesOnProduct } from '@prisma/client';
import { Suspense } from 'react';

interface TransactionItemColumns {
  name: string;
  size: string;
  quantity: number;
  price: string;
  subtotal: string;
  status: string;
}

export const columns: ColumnDef<TransactionItemColumns>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'delivered',
    header: 'Delivered',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'subtotal',
    header: 'Subtotal',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },

  {
    id: 'actions',
    // @ts-ignore
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
