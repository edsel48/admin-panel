import prismadb from '@/lib/prismadb';
import { PromoForm } from './components/promo-form';

const PromoPage = async ({
  params,
}: {
  params: { promoId: string; storeId: string };
}) => {
  const promo = await prismadb.promo.findUnique({
    where: {
      id: params.promoId,
    },
  });

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PromoForm
          products={products.map((item) => ({
            id: item.id,
            name: item.name,
          }))}
          initialData={promo}
        />
      </div>
    </div>
  );
};

export default PromoPage;
