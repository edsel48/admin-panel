'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type MemberColumns = {
  id: string;
  name: string;
  tier: string;
  username: string;
  status: boolean;
  createdAt: string;
};

export const columns: ColumnDef<MemberColumns>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'tier',
    header: 'Tier',
  },
  {
    accessorKey: 'username',
    header: 'Username',
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
