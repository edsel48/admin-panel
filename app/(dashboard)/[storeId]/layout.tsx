import Navbar from '@/components/navbar';
import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import { currentUser } from '@clerk/nextjs';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  const storeHelper = await prismadb.storeHelper.findFirst({
    where: {
      userId,
    },
  });

  const user = await currentUser();

  // setup member here
  if (user != null) {
    const member = await prismadb.member.findMany({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    console.log(member);

    if (member.length == 0) {
      // create new member here
      const newMember = await prismadb.member.create({
        data: {
          name: user.firstName || '',
          limit: 0,
          email: user.emailAddresses[0].emailAddress,
          username: user.username || user.emailAddresses[0].emailAddress,
          password: '',
        },
      });

      redirect('https://store.mitra-solusi.shop/');
    }

    let person = member[0];

    if (person.type == 'MEMBER') {
      console.log('SENDING CUZ U MEMBER');
      redirect('https://store.mitra-solusi.shop/');
    }
  }

  if (!storeHelper) {
    console.log('SENDING CUZ U HAVE NO ACCESS');
    redirect('https://store.mitra-solusi.shop/');
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
