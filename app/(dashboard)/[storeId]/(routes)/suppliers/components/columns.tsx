'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

import { Product, SupplierTransaction } from '@prisma/client';

export type SupplierColumn = {
  id: string;
  name: string;
  products: Product[];
  createdAt: string;
  transactions: SupplierTransaction[];
};

export const columns: ColumnDef<SupplierColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
