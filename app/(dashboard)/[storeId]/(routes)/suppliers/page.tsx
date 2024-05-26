import prismadb from '@/lib/prismadb';
import { SupplierClient } from './components/client';
import { SupplierColumn } from './components/columns';
import { format } from 'date-fns';

const SupplierPage = async ({ params }: { params: { storeId: string } }) => {
  const suppliers = await prismadb.supplier.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      product: {
        include: {
          product: {
            include: {
              sizes: true,
            },
          },
        },
      },
      transactions: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedColumn: SupplierColumn[] = suppliers.map((item) => {
    return {
      id: item.id,
      name: item.name,
      createdAt: format(item.createdAt, 'dd MMMM yyyy'),
      products: item.product.map((p) => p.product),
      transactions: item.transactions,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SupplierClient data={formattedColumn} />
      </div>
    </div>
  );
};

export default SupplierPage;
