'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { parse } from 'path';
import { Star, StarOff } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

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
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex gap-3">Review Chart</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {average != null ? (
              <div className="flex w-full gap-3">
                {[...Array(average)].map((e) => (
                  <Star />
                ))}
                {[...Array(5 - average)].map((e) => (
                  <StarOff />
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div>{average} / 5</div>
        </CardContent>
      </Card>
    </>
  );
}
