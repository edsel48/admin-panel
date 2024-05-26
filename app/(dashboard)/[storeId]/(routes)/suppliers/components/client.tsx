'use client';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { SupplierColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface SupplierClientProps {
  data: SupplierColumn[];
}

export const SupplierClient: React.FC<SupplierClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Supplier (${data.length})`}
          description="Manage supplier for your store"
        />

        <div className="flex gap-5">
          <Button
            onClick={() => router.push(`/${params.storeId}/suppliers/new`)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Supplier
          </Button>
        </div>
      </div>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Supplier" />

      <Separator />

      <ApiList entityName="suppliers" entityIdName="supplierId" />
    </>
  );
};
