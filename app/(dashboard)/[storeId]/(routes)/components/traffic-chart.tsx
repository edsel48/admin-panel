'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
    <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex gap-3">Traffic Website Store</div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              chartType="Bar"
              width="100%"
              height="400px"
              data={data}
              options={options}
            />
          </CardContent>
        </Card></>
  );
}
