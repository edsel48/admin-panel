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

    const { name } = body;

    const admins = await prismadb.storeHelper.findMany({
      where: {
        userId: userId!!,
      },
    });

    if (!userId && admins.length == 0) {
      return new NextResponse('Unauthenticated', { status: 401 });
    }

    if (!name) return new NextResponse('Name is required', { status: 400 });

    const supplier = await prismadb.supplier.create({
      data: {
        name,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.error(`[SUPPLIER_POST] `, error);

    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  try {
    const suppliers = await prismadb.supplier.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error(`[SUPPLIER_GET] `, error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
