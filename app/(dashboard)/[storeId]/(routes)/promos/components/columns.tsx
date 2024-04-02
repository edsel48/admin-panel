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
  validUntil: string;
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
    accessorKey: 'validUntil',
    header: 'Valid Until',
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
