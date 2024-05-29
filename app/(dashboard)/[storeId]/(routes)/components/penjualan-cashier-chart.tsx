'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatter } from '@/lib/utils';
import { parse } from 'date-fns/parse';
import { isBefore } from 'date-fns';

export default function PenjualanCashierChart() {
  let [orders, setOrders] = useState([
    ['Date', 'Total'],
    ['29 05 2024', 'Rp. 12.000.000'],
  ]);

  useEffect(() => {
    let fetch = async () => {
      let response = await axios.get('/api/reports/penjualan/cashier');

      let { data } = response;

      console.log(data);

      let orderData = [];

      orderData.push(['Date', 'Total']);

      let keys = Object.keys(data);

      keys.sort((a, b) => {
        return isBefore(
          parse(b, 'dd MM yyyy', new Date()),
          parse(a, 'dd MM yyyy', new Date()),
        )
          ? 1
          : -1;

        return 0;
      });

      for (const key of keys) {
        orderData.push([key, data[key]]);
      }

      setOrders(orderData);
    };

    fetch();
  }, []);

  return (
    <>
      <h1 className="text-lg font-bold">Total Penjualan Cashier Minggu Ini</h1>
      <Chart
        chartType="Bar"
        width="100%"
        height="400px"
        data={orders}
        options={options}
      />
    </>
  );
}
