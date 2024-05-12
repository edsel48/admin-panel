import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

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

  if (storeHelper) {
    redirect(`/${storeHelper[0].storeId}`);
  }

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
