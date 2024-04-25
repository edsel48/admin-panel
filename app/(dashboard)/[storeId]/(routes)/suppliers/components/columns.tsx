'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

import { Product } from '@prisma/client';

export type SupplierColumn = {
  id: string;
  name: string;
  products: Product[];
  createdAt: string;
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
