import prismadb from '@/lib/prismadb';
import { PriceForm, SizesPrices } from './components/prices-form';

const PricePage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
      sizes: {
        include: {
          size: true,
        },
      },
      suppliers: {
        include: {
          supplier: true,
        },
      },
    },
  });

  if (product == null) return <div> product not found </div>;

  // @ts-ignore
  let mappedProduct: SizesPrices[] = product.sizes
    .sort((a, b) => Number(a.size.value) - Number(b.size.value))
    .map((s) => {
      const { id, price, priceSilver, priceGold, pricePlatinum, stock } = s;

      return {
        name: s.size.name,
        id,
        price: Number(price),
        priceSilver: Number(priceSilver),
        priceGold: Number(priceGold),
        pricePlatinum: Number(pricePlatinum),
        stock: Number(stock),
      };
    });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {mappedProduct.map((e) => {
          return <PriceForm initialData={e} key={e.id} />;
        })}
      </div>
    </div>
  );
};

export default PricePage;
