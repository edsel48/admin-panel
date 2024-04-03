import prismadb from '@/lib/prismadb';
import { SupplierClient } from './components/client';
import { SupplierColumn } from './components/columns';
import { format } from 'date-fns';

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const suppliers = await prismadb.supplier.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedColumn: SupplierColumn[] = suppliers.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SupplierClient data={formattedColumn} />
      </div>
    </div>
  );
};

export default SizesPage;
