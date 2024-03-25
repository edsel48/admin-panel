import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, discount, productId, isArchived } = body;

    if (!userId) return new NextResponse('Unauthenticated', { status: 401 });

    if (!discount)
      return new NextResponse('Discount is required', { status: 400 });

    if (!productId)
      return new NextResponse('Product ID is required', { status: 400 });

    if (!params.storeId)
      return new NextResponse('Store ID is required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 403 });

    const promo = await prismadb.promo.create({
      data: {
        name,
        discount,
        productId,
        storeId: params.storeId,
        isArchived,
      },
    });

    return NextResponse.json(promo);
  } catch (error) {
    console.error(`[PROMO_POST] `, error);

    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    if (!params.storeId)
      return new NextResponse('Store id is required', { status: 400 });

    const promos = await prismadb.promo.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(promos);
  } catch (error) {
    console.error(`[PROMO_GET] `, error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
