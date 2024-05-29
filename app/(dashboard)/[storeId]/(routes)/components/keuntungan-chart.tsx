'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatter } from '@/lib/utils';

export default function KeuntunganChart() {
  const [keuntungan, setKeuntungan] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.get('/api/reports/keuntungan');

      let { data } = response;

      setKeuntungan(data);
    };

    fetch();
  }, []);

  return (
    <div className="flex-col gap-5">
      <h1 className="text-lg font-bold">Keuntungan</h1>
      <div>
        {/* @ts-ignore */}
        {formatter.format(keuntungan)}
      </div>
    </div>
  );
}
