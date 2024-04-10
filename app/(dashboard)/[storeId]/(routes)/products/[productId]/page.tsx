import prismadb from '@/lib/prismadb';
import { ProductForm } from './components/product-form';
import { Option } from '@/components/ui/multi-select-helper';

const ProductPage = async ({
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
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const option: Option[] = sizes.map((size) => {
    return {
      value: size.id,
      label: size.name,
    };
  });

  const suppliers = await prismadb.supplier.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          suppliers={suppliers}
          sizesData={sizes}
          initialData={product}
          option={option}
        />
      </div>
    </div>
  );
};

export default ProductPage;
