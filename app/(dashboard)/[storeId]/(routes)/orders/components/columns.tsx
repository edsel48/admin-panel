'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';

import { useParams, useRouter } from 'next/navigation';
import CellAction from './cell-action';

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  total: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'id',
    header: 'Order Id',
  },
  {
    accessorKey: 'member',
    header: 'Member',
  },
  {
    accessorKey: 'total',
    header: 'Total Price',
  },
  {
    accessorKey: 'type',
    header: 'Order Type',
  },
  {
    accessorKey: 'status',
    header: 'Order Status',
  },
  {
    id: 'detail',
    // @ts-ignore
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
