import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string } },
) {
  try {
    const body = await req.json();

    const { price, priceSilver, priceGold, pricePlatinum, stock, weight } =
      body;

    const data = await prismadb.sizesOnProduct.update({
      where: {
        id: params.sizeId,
      },
      data: {
        price,
        priceSilver,
        priceGold,
        stock,
        pricePlatinum,
        weight,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    console.log('[PRODUCT_ON_SIZE_PATCH]', error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
