import prismadb from '@/lib/prismadb';
import { OrderClient } from './components/client';
import { OrderColumn } from './components/columns';
import { format } from 'date-fns';
import { formatter } from '@/lib/utils';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">Something</div>
    </div>
  );
};

export default OrdersPage;
