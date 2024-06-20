'use client';

import prismadb from '@/lib/prismadb';
import LineChart from './components/chart';

import axios from 'axios';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import TrafficChart from './components/traffic-chart';
import TerlarisChart from './components/terlaris-chart';
import KeuntunganChart from './components/keuntungan-chart';
import PenjualanWebsiteChart from './components/penjualan-website-chart';
import PenjualanCashierChart from './components/penjualan-cashier-chart';
import ArimaChart from './components/arima-chart';

import { useEffect, useState } from 'react';
import ReviewChart from './components/review-chart';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

import { Button } from '@/components/ui/button';
import PoChart from './components/po-chart';

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = ({ params }) => {
  let statuses = [
    'Laporan Product Terlaris',
    'Laporan Total Keuntungan',
    'Laporan PO',
    'Laporan Prediksi Stock Barang',
    'Laporan Traffic Website Toko',
    'Laporan Review Pengguna',
    'Laporan Total Penjualan Website',
    'Laporan Total Penjualan Cashier',
    'Laporan Ketersediaan Barang',
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
          {status == 'Laporan PO' ? <PoChart /> : <></>}
          {status == 'Laporan Product Terlaris' ? <TerlarisChart /> : <></>}
          {status == 'Laporan Total Keuntungan' ? <KeuntunganChart /> : <></>}
          {status == 'Laporan Traffic Website Toko' ? <TrafficChart /> : <></>}
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
          {status == 'Laporan Review Pengguna' ? <ReviewChart /> : <></>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
