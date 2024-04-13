import prismadb from '@/lib/prismadb';
import { MemberClient } from './components/client';
import { MemberColumns } from './components/columns';
import { format } from 'date-fns';

const MembersPage = async ({ params }: { params: { storeId: string } }) => {
  const members = await prismadb.member.findMany({
    include: {
      orders: true,
    },
  });

  const formattedMembers: MemberColumns[] = members.map((item) => ({
    id: item.id,
    name: item.name,
    username: item.username,
    tier: item.tier,
    status: item.status,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MemberClient data={formattedMembers} />
      </div>
    </div>
  );
};

export default MembersPage;
