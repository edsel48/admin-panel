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
        promo: true,
      },
    });

    console.log(product);

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
      categoryId,
      images,
      sizes,
      isFeatured,
      suppliers,
      isArchived,
      description,
    } = body;

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

    // disconnect
    //@ts-ignore
    let input: string[] = sizes.map((s) => s.value); // ids of input
    let now: string[] = nowProduct.sizes.map((s) => s.sizeId); // ids of product now

    // disconnect condition
    // when ids of product now is not in input
    const disconnect = now.filter((s) => !input.includes(s));

    const fullDisconnect = nowProduct.sizes.filter((now) => {
      //@ts-ignore
      let input = sizes.map((s) => s.value);

      return !input.includes(now.sizeId);
    });

    await prismadb.sizesOnProduct.deleteMany({
      where: {
        id: {
          in: fullDisconnect.map((e) => e.id),
        },
      },
    });

    // connect condition
    // when ids of input is not in product now data
    const connect = input.filter((s) => !now.includes(s));

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        categoryId,
        suppliers: {
          deleteMany: {},
        },
        images: {
          deleteMany: {},
        },
        isFeatured,
        description,
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
          create: connect.map((item) => {
            return {
              size: {
                connect: {
                  id: item,
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
