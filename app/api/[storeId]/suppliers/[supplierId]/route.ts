import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { supplierId: string } },
) {
  try {
    if (!params.supplierId) {
      return new NextResponse('Supplier id is required', { status: 400 });
    }

    const supplier = await prismadb.supplier.findUnique({
      where: {
        id: params.supplierId,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.log('[SUPPLIER_GET]', error);

    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; supplierId: string } },
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

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    if (!params.supplierId) {
      return new NextResponse('Supplier id is required', { status: 400 });
    }

    const supplier = await prismadb.supplier.updateMany({
      where: {
        id: params.supplierId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(supplier);
  } catch (error) {
    console.log('[SUPPLIER_PATCH]', error);

    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; supplierId: string } },
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

    if (!params.supplierId) {
      return new NextResponse('Supplier id is required', { status: 400 });
    }

    const size = await prismadb.supplier.deleteMany({
      where: {
        id: params.supplierId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[SUPPLIER_DELETE]', error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
