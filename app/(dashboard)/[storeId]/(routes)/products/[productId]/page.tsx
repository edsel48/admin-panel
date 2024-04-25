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
      suppliers: {
        include: {
          supplier: true,
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

  const sizesOption: Option[] = sizes.map((size) => {
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

  const suppliersOption: Option[] = suppliers.map((sp) => {
    return {
      value: sp.id,
      label: sp.name,
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          sizesData={sizes}
          suppliersData={suppliers}
          suppliersOption={suppliersOption}
          initialData={product}
          sizesOption={sizesOption}
        />
      </div>
    </div>
  );
};

export default ProductPage;
