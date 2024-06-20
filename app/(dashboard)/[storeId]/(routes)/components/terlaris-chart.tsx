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

import { format, subDays, subMonths, subYears } from 'date-fns';
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

export default function TerlarisChart() {
  const [terlaris, setTerlaris] = useState([['Product', 'Total']]);
  const [limit, setLimit] = useState(3);

  const [profitableProduct, setProfitableProduct] = useState([]);
  const [products, setProducts] = useState([]);

  const [lessProfitableProduct, setLessProfitableProduct] = useState([]);

  useEffect(() => {
    let fetch = async () => {
      let response = await axios.get('/api/reports/terlaris');
      let terlaris = response.data;

      let productResponse = await axios.get('/api/reports/keuntungan/products');
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
                onClick={() => {
                  if (products.length >= limit * 2) {
                    // get profitable based on limit
                    // @ts-ignore
                    let profit = [];
                    // @ts-ignore
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
                  } else {
                    toast.error(
                      `Cannot Do more than ${Math.floor(products.length / 2)}`,
                    );
                  }
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
                      <TableHead>Created At</TableHead>
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
                              {format(e.product.createdAt, 'dd-MM-yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              {/* @ts-ignore */}
                              {formatter.format(e.value)}
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
                      <TableHead>Created At</TableHead>
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
                              {format(e.product.createdAt, 'dd-MM-yyyy')}
                            </TableCell>
                            <TableCell className="text-right">
                              {/* @ts-ignore */}
                              {formatter.format(e.value)}
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
