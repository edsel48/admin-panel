import prismadb from '@/lib/prismadb';
import Chart from "./components/chart"

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <Chart />;
};

export default DashboardPage;
