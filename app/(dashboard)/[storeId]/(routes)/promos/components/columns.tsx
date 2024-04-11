'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

import { Ban, Check, Minus } from 'lucide-react';

export type PromoColumn = {
  id: string;
  name: string;
  productLabel: string;
  discount: string;
  maximumDiscountAmount: string;
  minimumAmountBought: string;
  useCount: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  isArchived: boolean;
};

export const columns: ColumnDef<PromoColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'product',
    header: 'Product',
    cell: ({ row }) => row.original.productLabel,
  },
  {
    accessorKey: 'discount',
    header: 'Discount',
  },
  {
    accessorKey: 'maximumDiscountAmount',
    header: 'Maximum Discount Amount',
  },
  {
    accessorKey: 'minimumAmountBought',
    header: 'Minimum Amount Bought',
  },
  {
    accessorKey: 'useCount',
    header: 'Use Count',
  },
  {
    accessorKey: 'startDate',
    header: 'Starts From',
  },
  {
    accessorKey: 'endDate',
    header: 'Ends In',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived',
    cell: ({ row }) => row.original.isArchived && <Check />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
