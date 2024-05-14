import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { promoId: string } },
) {
  try {
    if (!params.promoId) {
      return new NextResponse('Promo id is required', { status: 400 });
    }

    const promo = await prismadb.promo.findUnique({
      where: {
        id: params.promoId,
      },
      include: {
        product: true,
      },
    });
    return NextResponse.json(promo);
  } catch (error) {
    console.log('[PROMO_GET]', error);

    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; promoId: string } },
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      discount,
      productId,
      isArchived,
      maximumDiscountAmount,
      minimumAmountBought,
      startDate,
      endDate,
      maximalUseCount,
      useCount,
    } = body;

    const admins = await prismadb.storeHelper.findMany({
      where: {
        userId: userId!!,
      },
    });

    if (!userId && admins.length == 0) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!discount)
      return new NextResponse('Discount is required', { status: 400 });

    if (!productId)
      return new NextResponse('Product ID is required', { status: 400 });

    if (!params.storeId)
      return new NextResponse('Store ID is required', { status: 400 });

    if (!params.promoId)
      return new NextResponse('Promo ID is required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 403 });

    const promo = await prismadb.promo.updateMany({
      where: {
        id: params.promoId,
      },
      data: {
        name,
        discount,
        productId,
        isArchived,
        maximumDiscountAmount,
        minimumAmountBought,
        startDate,
        endDate,
        maximalUseCount,
        useCount,
      },
    });

    return NextResponse.json(promo);
  } catch (error) {
    console.log('[PROMO_PATCH]', error);

    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; promoId: string } },
) {
  try {
    const { userId } = auth();

    const admins = await prismadb.storeHelper.findMany({
      where: {
        userId: userId!!,
      },
    });

    if (!userId && admins.length == 0) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!params.promoId) {
      return new NextResponse('Promo id is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('Unauthorized', { status: 403 });

    const promo = await prismadb.promo.deleteMany({
      where: {
        id: params.promoId,
      },
    });

    return NextResponse.json(promo);
  } catch (error) {
    console.log('[PROMO_DELETE]', error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
