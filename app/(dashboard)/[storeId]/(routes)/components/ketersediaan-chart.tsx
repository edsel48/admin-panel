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
                <TableHead>Size Name</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* @ts-ignore */}
              {products.map((product) => {
                // @ts-ignore
                return (
                  // @ts-ignore
                  product.sizes
                    // @ts-ignore
                    .sort((a, b) => a.stock - b.stock)
                    // @ts-ignore
                    .map((size) => {
                      return (
                        <TableRow>
                          {/* @ts-ignore */}
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{size.stock}</TableCell>
                          {/* @ts-ignore */}
                          <TableCell>{size.size.name}</TableCell>
                          {/* @ts-ignore */}
                          <TableCell>
                            {/* @ts-ignore */}
                            {format(product.createdAt, 'dd-MM-yyyy')}
                          </TableCell>
                          <TableCell>
                            {size.stock < 5 ? (
                              <Badge variant="destructive">Low</Badge>
                            ) : size.stock < 10 ? (
                              <Badge variant="secondary">Medium</Badge>
                            ) : (
                              <Badge>High</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
