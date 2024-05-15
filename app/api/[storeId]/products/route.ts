import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { Size } from '@prisma/client';
import { Option } from '@/components/ui/multi-select-helper';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const {
      name,
      categoryId,
      sizes,
      suppliers,
      images,
      isFeatured,
      description,
      isArchived,
    } = body;

    const admins = await prismadb.storeHelper.findMany({
      where: {
        userId: userId!!,
      },
    });

    if (!userId && admins.length == 0) {
      return new NextResponse('Unauthenticated', { status: 401 });
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
      return new NextResponse('Supplier id is required', { status: 400 });
    }

    const product = await prismadb.product.create({
      data: {
        name,
        isFeatured,
        isArchived,
        description,
        categoryId,
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
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log('[PRODUCTS_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const sizeId = searchParams.get('sizeId') || undefined;
    const isFeatured = searchParams.get('isFeatured');

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    let filtered = products;

    if (sizeId) {
      filtered = products.filter((p) => {
        let data = p.sizes;

        let arr = data.map((d) => d.sizeId);
        return arr.includes(sizeId);
      });
    }

    return NextResponse.json(filtered);
  } catch (error) {
    console.log('[PRODUCTS_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
