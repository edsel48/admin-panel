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
  discount: number;
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
  const { productIds, carts, total, memberId, address, totalDiscount } =
    await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product ids are required', { status: 400 });
  }

  const member = await prismadb.member.findFirst({
    where: {
      id: memberId,
    },
  });

  if (member == null)
    return new NextResponse('Member not found', { status: 404 });

  const allOrders = await prismadb.order.findMany({
    where: {
      memberId,
    },
  });

  let memberTotal = 0;

  allOrders.forEach((e) => {
    memberTotal += Number(e.total - e.totalDiscount);
  });

  let tier = member.tier;

  const FIVE_MILLION = 5000000;
  const TEN_MILLION = 10000000;

  if (total + memberTotal >= FIVE_MILLION) {
    if (member.tier == 'SILVER') {
      //update user to GOLD MEMBER
      await prismadb.member.update({
        where: {
          id: memberId,
        },
        data: {
          tier: 'GOLD',
        },
      });
    }
  }

  if (total + memberTotal >= TEN_MILLION) {
    if (member.tier == 'GOLD' || member.tier == 'SILVER') {
      await prismadb.member.update({
        where: {
          id: memberId,
        },
        data: {
          tier: 'PLATINUM',
        },
      });
    }
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
      isPaid: true,
      total,
      type: 'STORE',
      address,
      status: 'PAID',
      memberId,
      totalDiscount,
      orderItems: {
        create: carts.map((item: CartItems) => {
          let price = {
            SILVER: item.productSize.priceSilver,
            GOLD: item.productSize.priceGold,
            PLATINUM: item.productSize.pricePlatinum,
          };
          return {
            product: {
              connect: {
                id: item.product.id,
              },
            },
            // @ts-ignore
            size: item.productSize.size.name,
            quantity: item.quantity,
            // @ts-ignore
            subtotal: item.quantity * Number(price[tier]),
            // @ts-ignore
            discount: item.discount,
          };
        }),
      },
    },
  });

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
          gross_amount: total - totalDiscount,
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
