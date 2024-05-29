'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'path';
import { Star, StarOff } from 'lucide-react';

export default function ReviewChart() {
  let [average, setAverage] = useState(5);

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.get('/api/reports/review');
      let { data } = response;

      setAverage(data);
    };

    fetch();
  }, []);

  return (
    <>
      <h1 className="text-lg font-bold">Review Rata - Rata Toko</h1>
      {average != null ? (
        <div className="flex w-full gap-3">
          {...Array(average).map((e) => <Star />)}
          {...Array(5 - average).map((e) => <StarOff />)}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
