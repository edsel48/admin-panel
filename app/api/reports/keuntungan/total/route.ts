import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { isWithinInterval } from 'date-fns';
import { NextResponse } from 'next/server';
import { create } from 'zustand';

export async function GET(req: Request) {
  let orders = await prismadb.order.findMany({
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  //   @ts-ignore
  let filtered = [];

  orders.forEach((e) => {
    filtered.push({
      createdAt: e.createdAt,
      id: e.id,
      grandTotal: Number(e.total),
      type: e.type,
    });
  });

  //   @ts-ignore
  return NextResponse.json(filtered);
}
