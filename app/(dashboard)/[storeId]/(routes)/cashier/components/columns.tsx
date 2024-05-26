'use client';

import { ColumnDef } from '@tanstack/react-table';

import CellAction from './cell-action';

import { Button } from '@/components/ui/button';
import { Product, Size, SizesOnProduct } from '@prisma/client';
import { Suspense } from 'react';

export type ProductColumn = {
  id: string;
  name: string;
  sizes: SizesOnProduct[];
};

export type CashierColumn = {
  name: string;
  size: string;
  price: number;
  qty: number;
  subtotal: number;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'actions',
    // @ts-ignore
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const dataColumns: ColumnDef<CashierColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'qty',
    header: 'Quantity',
  },
  {
    accessorKey: 'subtotal',
    header: 'Subtotal',
  },
];

export const supplierColumns: ColumnDef<CashierColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Supplier Name',
  },
  {
    id: 'detail',
    header: 'Detail',
    cell: ({ row }) => <Button> Detail </Button>,
  },
  {
    accessorKey: 'status',
    header: 'Order Status',
  },
];
