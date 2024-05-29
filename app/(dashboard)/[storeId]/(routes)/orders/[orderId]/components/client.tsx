'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';
import { SupplierTransactionItem } from '@prisma/client';

interface TransactionClientProps {
  data: SupplierTransactionItem[];
}

export const TransactionClient: React.FC<TransactionClientProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      {/* @ts-ignore */}
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
