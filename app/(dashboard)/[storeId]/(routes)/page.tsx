import prismadb from '@/lib/prismadb';
import LineChart from './components/chart';

import axios from 'axios';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  return <LineChart />;
};

export default DashboardPage;
