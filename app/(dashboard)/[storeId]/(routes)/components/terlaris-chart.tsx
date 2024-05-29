'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'path';

export default function TerlarisChart() {
  const [terlaris, setTerlaris] = useState([['Product', 'Total']]);
  useEffect(() => {
    let fetch = async () => {
      let response = await axios.get('/api/reports/terlaris');
      let terlaris = response.data;

      setTerlaris(terlaris);
    };

    fetch();
  }, []);

  return (
    <div className="flex-col gap-5">
      <h1 className="text-lg font-bold">Barang Terlaris</h1>
      <div>
        {/* @ts-ignore */}
        {terlaris[0][0]} : {terlaris[0][1]} pcs
      </div>
    </div>
  );
}
