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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { formatter } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { parse } from 'date-fns';
import { subWeeks } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function KetersediaanChart() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      let response = await axios.get('/api/reports/ketersediaan');
      let { data } = response;

      setProducts(data);
    };

    fetch();
  }, []);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Ketersediaan Barang</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>List Barang dengan Stock</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* @ts-ignore */}
              {products.map((product) => {
                let stock = 0;

                let sizeMap = {
                  Piece: 1,
                  'Box (5)': 5,
                  'Box (10)': 10,
                  Lusin: 12,
                  Gross: 144,
                };

                // @ts-ignore
                product.sizes.forEach((e) => {
                  stock += e.size.value * e.stock;
                });

                // @ts-ignore
                return (
                  <TableRow>
                    {/* @ts-ignore */}
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{stock}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>
                      {/* @ts-ignore */}
                      {stock < product.minimumStock ? (
                        <Badge variant="destructive">Low</Badge>
                      ) : // @ts-ignore
                      stock + 5 < product.minimumStock ? (
                        <Badge variant="secondary">Medium</Badge>
                      ) : (
                        <Badge>High</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
