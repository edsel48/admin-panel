import { UserButton, auth } from '@clerk/nextjs';
import { MainNav } from '@/components/main-nav';

import StoreSwitcher from '@/components/store-switcher';
import { redirect } from 'next/navigation';
import prismadb from '@/lib/prismadb';

const Navbar = async () => {
  // fetching stores
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const admins = await prismadb.storeHelper.findMany({
    where: {
      userId,
    },
  });

  const store = await prismadb.store.findMany({
    where: {
      id: admins[0].storeId!!,
    },
  });

  return (
    <div className="border-b ">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={store} />

        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
