'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type PromoColumn = {
  id: string;
  name: string;
  productLabel: string;
  discount: string;
  expiredAt: string;
  createdAt: string;
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
    accessorKey: 'createdAt',
    header: 'Created At',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
