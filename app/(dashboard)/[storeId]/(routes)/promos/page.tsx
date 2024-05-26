import prismadb from '@/lib/prismadb';
import { PromoClient } from './components/client';
import { PromoColumn } from './components/columns';
import { format, isWithinInterval } from 'date-fns';
import { Promo } from '@prisma/client';

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

  let filteredPromo: Promo[] = [];

  promos.forEach((e) => {
    if (
      isWithinInterval(new Date(), {
        start: e.startDate,
        end: e.endDate,
      })
    ) {
      filteredPromo.push(e);
    }
  });

  const formattedPromo: PromoColumn[] = filteredPromo.map((item) => ({
    id: item.id,
    name: item.name,
    discount: `${item.discount}%`,
    maximumDiscountAmount: `${item.maximumDiscountAmount}`,
    minimumAmountBought: `${item.minimumAmountBought}`,
    useCount: `${
      Number(item.maximalUseCount != null ? item.maximalUseCount : 0) -
      Number(item.useCount != null ? item.useCount : 0)
    }`,
    startDate: format(item.startDate, 'dd MMMM yyyy'),
    endDate: format(item.endDate, 'dd MMMM yyyy'),
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
    // @ts-ignore
    productLabel: item.product.name,
    isArchived: item.isArchived,
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
