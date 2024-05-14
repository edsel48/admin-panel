import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  const storeHelper = await prismadb.storeHelper.findMany({
    where: {
      userId,
    },
  });

  if (storeHelper[0]) {
    redirect(`/${storeHelper[0].storeId}`);
  }

  if (store) {
    redirect(`/${store.id}`);
  }

  // create member here
  // create new member here
  if (user != null) {
    // check member
    const person = await prismadb.member.findFirst({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    });

    if (person != null) {
      if (person.type == 'ADMIN') {
        const admin = await prismadb.storeHelper.findFirst({
          where: {
            userId: userId,
          },
        });

        if (admin != null) {
          redirect(`/${admin.storeId}`);
        }
      }

      redirect('https://store.mitra-solusi.shop/');
    } else {
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
  }

  return <>{children}</>;
}
