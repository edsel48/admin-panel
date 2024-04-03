'use client';

import { ColumnDef } from '@tanstack/react-table';

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
    accessorKey: 'total',
    header: 'Total Price',
  },
];
