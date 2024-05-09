import prismadb from '@/lib/prismadb';
import { MemberForm } from './components/member-form';

const MemberPage = async ({
  params,
}: {
  params: { memberId: string; storeId: string };
}) => {
  const member = await prismadb.member.findUnique({
    where: {
      id: params.memberId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MemberForm initialData={member} />
      </div>
    </div>
  );
};

export default MemberPage;
