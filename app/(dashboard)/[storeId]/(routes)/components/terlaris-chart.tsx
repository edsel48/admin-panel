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

export default function TerlarisChart() {
  const [terlaris, setTerlaris] = useState([['Product', 'Total']]);

  const [profitableProduct, setProfitableProduct] = useState([]);
  const [lessProfitableProduct, setLessProfitableProduct] = useState([]);

  useEffect(() => {
    let fetch = async () => {
      let response = await axios.get('/api/reports/terlaris');
      let terlaris = response.data;

      let productResponse = await axios.get('/api/reports/keuntungan/products');
      let products = productResponse.data;

      let length = products.length;

      if (products.length >= 10) {
        // @ts-ignore
        setProfitableProduct([
          // @ts-ignore
          products[0],
          // @ts-ignore
          products[1],
          // @ts-ignore
          products[2],
          // @ts-ignore
          products[3],
          // @ts-ignore
          products[4],
        ]);

        // @ts-ignore
        setLessProfitableProduct([
          // @ts-ignore
          products[products.length - 5],
          // @ts-ignore
          products[products.length - 4],
          // @ts-ignore
          products[products.length - 3],
          // @ts-ignore
          products[products.length - 2],
          // @ts-ignore
          products[products.length - 1],
        ]);
      }

      setTerlaris(terlaris);
    };

    fetch();
  }, []);

  return (
    <div className="flex-col gap-5">
      <div className="mt-3 flex gap-5">
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
                <TableCaption>Top 5 Profitable Products</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Product Name</TableHead>
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
                <TableCaption>Top 5 Less Profitable Products</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Product Name</TableHead>
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
  );
}
