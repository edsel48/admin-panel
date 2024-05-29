'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'path';

export default function TrafficChart() {
  let [data, setData] = useState<string[][]>([
    ['Test', 'Check'],
    ['10 02 2022', '10'],
  ]);
  useEffect(() => {
    let fetch = async () => {
      let response = await axios.get('/api/reports/traffic');
      let traffics = response.data;

      let parsed = [];

      parsed.push(['Date', 'Traffic']);

      let keys = Object.keys(traffics);

      for (const key of keys) {
        parsed.push([key, traffics[key].length]);
      }

      setData(parsed);
    };

    fetch();
  }, []);

  return (
    <>
<h1 className="text-lg font-bold">
        Traffic Website Store
    </h1>
      <Chart
        chartType="Bar"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </>
  );
}
