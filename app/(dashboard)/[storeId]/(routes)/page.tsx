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

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = ({ params }) => {
  const [status, setStatus] = useState('PREDIKSI');

  return (
    <div className="h-screen w-full p-5">
      <div className="flex-col gap-3">
        <div className="leftmenu mr-3 flex gap-5 pr-5">
          <div
            onClick={() => {
              setStatus('PREDIKSI');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'PREDIKSI' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Prediksi Stock Barang{' '}
          </div>
          <div
            onClick={() => {
              setStatus('TERLARIS');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'TERLARIS' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Product Terlaris{' '}
          </div>
          <div
            onClick={() => {
              setStatus('KEUNTUNGAN');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'KEUNTUNGAN' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Total Keuntungan{' '}
          </div>
          <div
            onClick={() => {
              setStatus('TRAFFIC');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'TRAFFIC' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Traffic Website Toko{' '}
          </div>
          <div
            onClick={() => {
              setStatus('REVIEW');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'REVIEW' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Laporan Review Pengguna{' '}
          </div>
          <div
            onClick={() => {
              setStatus('PENJUALAN-WEBSITE');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'PENJUALAN-WEBSITE' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Total Penjualan Website Mingguan{' '}
          </div>
          <div
            onClick={() => {
              setStatus('PENJUALAN-CASHIER');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'PENJUALAN-CASHIER' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Total Penjualan Cashier Mingguan{' '}
          </div>
          <div
            onClick={() => {
              setStatus('PERSEDIAAN');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'PERSEDIAAN' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Persediaan Barang{' '}
          </div>
          <div
            onClick={() => {
              setStatus('PO');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'PO' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Laporan PO{' '}
          </div>
          <div
            onClick={() => {
              setStatus('PEMBELIAN');
            }}
            className={`mb-2 mt-2 px-1 py-3 hover:cursor-pointer hover:bg-black hover:text-white ${status == 'PEMBELIAN' ? 'bg-black text-white' : 'bg-white text-black'}`}
          >
            {' '}
            Laporan Pembelian{' '}
          </div>
        </div>
        <hr className="my-5" />
        <div className="h-screen w-full flex-1 items-center justify-center">
          {status == 'PREDIKSI' ? <ArimaChart /> : <></>}
          {status == 'TERLARIS' ? <TerlarisChart /> : <></>}
          {status == 'KEUNTUNGAN' ? <KeuntunganChart /> : <></>}
          {status == 'TRAFFIC' ? <TrafficChart /> : <></>}
          {status == 'PENJUALAN-WEBSITE' ? <PenjualanWebsiteChart /> : <></>}
          {status == 'PENJUALAN-CASHIER' ? <PenjualanCashierChart /> : <></>}
          {status == 'REVIEW' ? <ReviewChart /> : <></>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
