'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  format,
  isWithinInterval,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { formatter } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { parse } from 'path';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';

import { Calendar } from '@/components/ui/calendar';

import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

export default function TerlarisChart() {
  const [terlaris, setTerlaris] = useState([['Product', 'Total']]);
  const [limit, setLimit] = useState(3);

  const [startAt, setStartAt] = useState<Date | undefined>(new Date());
  const [endAt, setEndAt] = useState<Date | undefined>(new Date());

  const [profitableProduct, setProfitableProduct] = useState([]);
  const [products, setProducts] = useState([]);

  const [lessProfitableProduct, setLessProfitableProduct] = useState([]);

  const update = async () => {
    console.log({
      startAt,
      endAt,
    });
    let response = await axios.post('/api/reports/terlaris', {
      start: startAt,
      end: endAt,
    });
    let terlaris = response.data;

    let productResponse = await axios.post('/api/reports/keuntungan/products', {
      start: startAt,
      end: endAt,
    });
    let products = productResponse.data;

    setProducts(products);

    let length = products.length;

    if (products.length >= limit * 2) {
      // get profitable based on limit
      let profit = [];
      let nonprof = [];

      for (let i = 0; i < limit; i++) {
        profit.push(products[i]);
        if (nonprof.length < limit) {
          nonprof.push(products[products.length - 1 - i]);
        }
      }

      // @ts-ignore
      setProfitableProduct(profit);

      // @ts-ignore
      setLessProfitableProduct(nonprof);
    }

    setTerlaris(terlaris);
  };

  useEffect(() => {
    let fetch = async () => {
      let response = await axios.post('/api/reports/terlaris', {
        start: null,
        end: null,
      });
      let terlaris = response.data;

      let productResponse = await axios.post(
        '/api/reports/keuntungan/products',
        {
          start: null,
          end: null,
        },
      );
      let products = productResponse.data;

      setProducts(products);

      let length = products.length;

      if (products.length >= limit * 2) {
        // get profitable based on limit
        let profit = [];
        let nonprof = [];

        for (let i = 0; i < limit; i++) {
          profit.push(products[i]);
          if (nonprof.length < limit) {
            nonprof.push(products[products.length - 1 - i]);
          }
        }

        // @ts-ignore
        setProfitableProduct(profit);

        // @ts-ignore
        setLessProfitableProduct(nonprof);
      }

      setTerlaris(terlaris);
    };

    fetch();
  }, []);

  return (
    <div className="flex-col gap-5">
      <div className="mt-3 flex-col gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Set Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-5">
              <Card>
                <CardHeader>Start Date</CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] justify-start text-left font-normal',
                          !startAt && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startAt ? (
                          format(startAt, 'PPP')
                        ) : (
                          <span>Pick start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startAt}
                        onSelect={setStartAt}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>End Date</CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] justify-start text-left font-normal',
                          !endAt && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endAt ? (
                          format(endAt, 'PPP')
                        ) : (
                          <span>Pick end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endAt}
                        onSelect={setEndAt}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>
              <Button
                onClick={async () => {
                  await update();
                }}
              >
                Set Period
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Set Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                onBlur={(e) => {
                  setLimit(Number(e.currentTarget.value));
                }}
              />
              <Button
                onClick={async () => {
                  await update();
                }}
              >
                Check
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex gap-3">
                    Laporan Barang Paling Menguntungkan
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* will be filled with top 5 barang yang menguntungkann */}
                <Table>
                  <TableCaption>Top {limit} Profitable Products</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Total Transaction</TableHead>
                      <TableHead>Total Product Count</TableHead>
                      <TableHead className="text-right">Profits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profitableProduct &&
                      // @ts-ignore
                      profitableProduct.map((e) => {
                        console.log(e);
                        return (
                          <TableRow>
                            <TableCell className="font-medium">
                              {/* @ts-ignore */}
                              {e.product.name}
                            </TableCell>
                            <TableCell>
                              {/* @ts-ignore */}
                              {terlaris.transactionCount[e.product.name]}
                            </TableCell>
                            <TableCell className="font-medium">
                              {/* @ts-ignore */}
                              {terlaris.count[e.product.name] || 0}
                            </TableCell>
                            <TableCell className="text-right">
                              {/* @ts-ignore */}
                              {formatter.format(e.value * (1 - (1 - 0.175)))}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex gap-3">
                    Laporan Barang Paling Tidak Menguntungkan
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>
                    Top {limit} Less Profitable Products
                  </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Total Transaction</TableHead>
                      <TableHead>Total Product Count</TableHead>
                      <TableHead className="text-right">Profits</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessProfitableProduct &&
                      // @ts-ignore
                      lessProfitableProduct.map((e) => {
                        return (
                          <TableRow>
                            <TableCell className="font-medium">
                              {/* @ts-ignore */}
                              {e.product.name}
                            </TableCell>
                            <TableCell>
                              {/* @ts-ignore */}
                              {terlaris.transactionCount[e.product.name] || 0}
                            </TableCell>
                            <TableCell className="font-medium">
                              {/* @ts-ignore */}
                              {terlaris.count[e.product.name] || 0}
                            </TableCell>
                            <TableCell className="text-right">
                              {/* @ts-ignore */}
                              {formatter.format(e.value * (1 - (1 - 0.175)))}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
