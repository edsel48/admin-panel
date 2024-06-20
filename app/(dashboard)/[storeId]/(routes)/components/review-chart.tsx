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

const Review = ({
  name,
  review,
  star,
}: {
  name: string;
  review: string;
  star: number;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex gap-3">{name}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex-col gap-3">
          <div>{review}</div>
          <div className="mt-3 flex">
            {[...Array(star)].map((e) => (
              <Star />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function ReviewChart() {
  let [average, setAverage] = useState(5);

  useEffect(() => {
    const fetch = async () => {
      let response = await axios.get('/api/reports/review');
      let { data } = response;

      setAverage(5);
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
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex gap-3">Reviews</div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-5">
            {[
              {
                name: 'Alex',
                review: 'Clean and good looking website',
                star: 5,
              },
              {
                name: 'Hans Leo.',
                review: 'Pembayaran Mudah dan aman',
                star: 5,
              },
              { name: 'Ariel', review: 'Website keren dan bersih', star: 5 },
            ].map((e) => {
              return <Review name={e.name} review={e.review} star={e.star} />;
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
