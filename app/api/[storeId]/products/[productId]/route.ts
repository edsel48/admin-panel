import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { Option } from '@/components/ui/multi-select-helper';

export async function GET(
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
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

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const product = await prismadb.product.delete({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } },
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      price,
      priceSilver,
      priceGold,
      pricePlatinum,
      categoryId,
      images,
      sizes,
      isFeatured,
      suppliers,
      isArchived,
    } = body;

    console.log({
      priceSilver, priceGold, pricePlatinum
    })

    if (!userId) {
      return new NextResponse('Unauthenticated', { status: 403 });
    }

    if (!params.productId) {
      return new NextResponse('Product id is required', { status: 400 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!images || !images.length) {
      return new NextResponse('Images are required', { status: 400 });
    }

    if (!price) {
      return new NextResponse('Price is required', { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse('Category id is required', { status: 400 });
    }

    if (!sizes) {
      return new NextResponse('Sizes is required', { status: 400 });
    }

    if (!suppliers) {
      return new NextResponse('Suppliers is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 405 });
    }

    const nowProduct = (await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
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
    })) ?? {
      sizes: [],
    };

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        priceSilver,
        priceGold,
        pricePlatinum,
        categoryId,
        suppliers: {
          deleteMany: {},
        },
        sizes: {
          deleteMany: {},
        },
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        sizes: {
          create: sizes.map((item: Option) => {
            return {
              size: {
                connect: {
                  id: item.value,
                },
              },
            };
          }),
        },
        suppliers: {
          create: suppliers.map((item: Option) => {
            return {
              supplier: {
                connect: {
                  id: item.value,
                },
              },
            };
          }),
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
