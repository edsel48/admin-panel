import useCart from '@/hooks/use-supplier-transaction';
import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';

interface CashierColumn {
  name: string;
  size: string;
  price: number;
  qty: number;
  subtotal: number;
}

const checkStock = async (product: string, size: string, qty: number) => {
  let productData = await prismadb.product.findFirst({
    where: {
      name: product,
    },
    include: {
      category: true,
      sizes: {
        include: {
          product: true,
          size: true,
        },
      },
      suppliers: {
        include: {
          supplier: true,
          product: true,
        },
      },
    },
  });

  if (productData == null)
    return {
      id: '-',
      name: '-',
      price: 0,
      size: '-',
      sizeId: '-',
      qty: 0,
      output: false,
      stock: 0,
    };

  let output = false;
  let stock = 0;
  let price = 0;
  let sizeId = '-';
  productData.sizes.forEach((e) => {
    if (e.size.name == size) {
      stock = Number(e.stock);
      sizeId = e.id;
      price = Number(e.price);
      if (Number(e.stock) >= qty) {
        output = true;
      }
    }
  });

  return {
    id: productData.id,
    name: productData.name,
    price,
    size,
    qty,
    sizeId,
    output,
    stock,
  };
};

const checkAllTrue = (data: boolean[]) => {
  let output = true;

  output = data.every((e) => e);

  return output;
};

const countTotal = (
  data: {
    id: string;
    name: string;
    output: boolean;
    stock: number;
    price: number;
    size: string;
    sizeId: string;
    qty: number;
  }[],
) => {
  let total = 0;

  for (const d of data) {
    total += d.price * d.qty;
  }

  return total;
};

export async function POST(req: Request) {
  try {
    let output: {
      id: string;
      name: string;
      output: boolean;
      stock: number;
      sizeId: string;
      price: number;
      size: string;
      qty: number;
    }[] = [];
    let body = await req.json();
    let { carts }: { carts: CashierColumn[] } = body;

    for (const cart of carts) {
      output.push(await checkStock(cart.name, cart.size, cart.qty));
    }

    // @ts-ignore
    if (!checkAllTrue(output.map((e) => e.output))) {
      let products: {
        name: string;
        stock: number;
      }[] = [];

      output.forEach((e) => {
        if (!e.output) {
          products.push({
            name: e.name,
            stock: e.stock,
          });
        }
      });

      return NextResponse.json(
        {
          error: `${products.length > 1 ? 'Products' : 'Product'} : '${products.map((e) => e.name).join(', ')}' ${products.length > 1 ? 'are' : 'is'} out of stock`,
        },
        { status: 400 },
      );
    }

    const total: number = countTotal(output);

    // do checkout if success
    const order = await prismadb.order.create({
      data: {
        storeId: '80a8dcfd-0ac4-4225-9242-eb0b9ff734dc',
        isPaid: true,
        total,
        type: 'CASHIER',
        orderItems: {
          create: output.map((item) => ({
            product: {
              connect: {
                id: item.id,
              },
            },
            size: item.size,
            quantity: Number(item.qty),
            subtotal: Number.parseInt(
              `${Number.parseInt(`${item.qty}`) * Number.parseInt(`${item.price}`)}`,
            ),
          })),
        },
      },
    });

    // updating stock
    for (const data of output) {
      await prismadb.sizesOnProduct.update({
        where: {
          id: data.sizeId,
        },
        data: {
          stock: {
            decrement: Number(data.qty),
          },
        },
      });
    }

    return NextResponse.json(order.id);
  } catch (error) {
    console.error(`[CASHIER_CHECKOUT_POST] `, error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
