import prismadb from '@/lib/prismadb';
import { PromoClient } from './components/client';
import { PromoColumn } from './components/columns';
import { format } from 'date-fns';

const PromoPage = async ({ params }: { params: { storeId: string } }) => {
  const promos = await prismadb.promo.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedPromo: PromoColumn[] = promos.map((item) => ({
    id: item.id,
    name: item.name,
    discount: `${item.discount}%`,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
    productLabel: item.product.name,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PromoClient data={formattedPromo} />
      </div>
    </div>
  );
};

export default PromoPage;
