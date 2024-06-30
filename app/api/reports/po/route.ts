import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import subDays from 'date-fns/subDays';
import { format, isWithinInterval } from 'date-fns';
import { Product, SizesOnProduct } from '@prisma/client';

export async function GET(req: Request) {
  try {
    let products = await prismadb.product.findMany({
      include: {
        sizes: {
          include: {
            size: true,
          },
        },
      },
    });

    // setting up product limit to 5
    const CRITICAL_LIMIT = 5;
    const MEDIUM_LIMIT = 10;

    let filtered: {
      product: Product;
      status: string;
      size: SizesOnProduct;
    }[] = [];

    products.forEach((product) => {
      product.sizes.forEach((size) => {
        if (Number(size.stock) <= Number(size.minimumStock)) {
          filtered.push({
            product,
            status: 'CRITICAL',
            size: size,
          });
        }
      });
    });

    return NextResponse.json(filtered);
  } catch (e) {
    return new NextResponse('Internal error', { status: 500 });
  }
}
