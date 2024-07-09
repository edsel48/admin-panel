'use client';

import prismadb from '@/lib/prismadb';
import LineChart from './components/chart';

import axios from 'axios';
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';
import ReviewChart from './components/review-chart';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { Button } from '@/components/ui/button';

import dynamic from 'next/dynamic';

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = ({ params }) => {
  let router = useRouter();

  const TrafficChart = dynamic(
    () => import('./components/traffic-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );

  const KetersediaanChart = dynamic(
    () => import('./components/ketersediaan-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );

  const PoChart = dynamic(
    () => import('./components/po-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );

  const TerlarisChart = dynamic(
    () => import('./components/terlaris-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );
  const KeuntunganChart = dynamic(
    () => import('./components/keuntungan-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );
  const PenjualanWebsiteChart = dynamic(
    () =>
      import('./components/penjualan-website-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );
  const PenjualanCashierChart = dynamic(
    () =>
      import('./components/penjualan-cashier-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );
  const PenjualanWebsiteTable = dynamic(
    () =>
      import('./components/penjualan-website-table').then((res) => res.default),
    {
      ssr: false,
    },
  );
  const ArimaChart = dynamic(
    () => import('./components/arima-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );
  const PembelianChart = dynamic(
    () => import('./components/pembelian-chart').then((res) => res.default),
    {
      ssr: false,
    },
  );

  useEffect(() => {
    router.refresh();
  }, []);

  let statuses = [
    'Laporan Product Terlaris',
    'Laporan Total Keuntungan',
    'Laporan Barang Yang Hampir Habis',
    'Laporan Prediksi Stock Barang',
    'Laporan Traffic Website Toko',
    // 'Laporan Review Pengguna',
    'Laporan Total Penjualan Website',
    'Laporan Total Penjualan Cashier',
    'Laporan Ketersediaan Barang',
    'Laporan Tabel Penjualan Website',
    'Laporan Pembelian',
  ];

  const [status, setStatus] = useState(statuses[0]);

  return (
    <div className="h-screen w-full p-5">
      <div className="flex-col gap-3">
        <ScrollArea>
          <div className="leftmenu mr-3 flex gap-5 pb-5 pr-5">
            {statuses.map((e) => {
              if (status == e) {
                return (
                  <Button
                    onClick={() => {
                      setStatus(e);
                    }}
                  >
                    {e}
                  </Button>
                );
              } else {
                return (
                  <Button
                    onClick={() => {
                      setStatus(e);
                    }}
                    variant={'outline'}
                  >
                    {e}
                  </Button>
                );
              }
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <hr className="my-5" />
        <div className="h-screen w-full flex-1 items-center justify-center">
          {status == 'Laporan Prediksi Stock Barang' ? <ArimaChart /> : <></>}
          {status == 'Laporan Barang Yang Hampir Habis' ? <PoChart /> : <></>}
          {status == 'Laporan Product Terlaris' ? <TerlarisChart /> : <></>}
          {status == 'Laporan Total Keuntungan' ? <KeuntunganChart /> : <></>}
          {status == 'Laporan Traffic Website Toko' ? <TrafficChart /> : <></>}
          {status == 'Laporan Tabel Penjualan Website' ? (
            <PenjualanWebsiteTable />
          ) : (
            <></>
          )}
          {status == 'Laporan Total Penjualan Website' ? (
            <PenjualanWebsiteChart />
          ) : (
            <></>
          )}
          {status == 'Laporan Total Penjualan Cashier' ? (
            <PenjualanCashierChart />
          ) : (
            <></>
          )}
          {/* {status == 'Laporan Review Pengguna' ? <ReviewChart /> : <></>} */}
          {status == 'Laporan Pembelian' ? <PembelianChart /> : <></>}
          {status == 'Laporan Ketersediaan Barang' ? (
            <KetersediaanChart />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
