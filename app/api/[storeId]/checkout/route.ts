import { NextResponse } from 'next/server';

import { currentUser } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

import { Product, SizesOnProduct } from '@prisma/client';

import axios from 'axios';

//@ts-ignore
import Midtrans from 'midtrans-client';

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.SECRET,
  clientKey: process.env.NEXT_PUBLIC_CLIENT,
});

interface CartItems {
  product: Product;
  productSize: SizesOnProduct;
  quantity: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  const { productIds, carts, total } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product ids are required', { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  // create order from here
  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      total,
      orderItems: {
        create: carts.map((item: CartItems) => ({
          product: {
            connect: {
              id: item.product.id,
            },
          },
          quantity: item.quantity,
          subtotal: item.quantity * Number(item.productSize.price),
        })),
      },
    },
  });

  // remove data quantity from stocks
  for (const item of carts as CartItems[]) {
    await prismadb.sizesOnProduct.update({
      where: {
        id: item.productSize.id,
      },
      data: {
        stock: {
          decrement: item.quantity,
        },
      },
    });
  }

  const user = await currentUser();

  try {
    const options = {
      method: 'POST',
      url: 'https://app.sandbox.midtrans.com/snap/v1/transactions',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization:
          'Basic U0ItTWlkLXNlcnZlci1kYW9BcUVfcHRHbllwVnZIVE9UbEF6OW46',
      },
      data: {
        transaction_details: {
          order_id: order.id,
          gross_amount: total,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: user?.firstName,
          last_name: user?.lastName,
          email: user?.emailAddresses,
          phone: user?.phoneNumbers,
        },
      },
    };

    let request = await axios.request(options);

    let token = request.data.token;

    console.log(request.data);

    return NextResponse.json(
      { token },
      {
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error(`[CHECKOUT_POST] `, error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
