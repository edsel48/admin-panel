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
import {
  format,
  isWithinInterval,
  subDays,
  subMonths,
  subYears,
  parse,
  isBefore,
} from 'date-fns';

import { subWeeks } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { TransactionClient } from './../suppliers/[supplierId]/transactions/[transactionId]/components/client';

import { useRouter, useParams } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import { Calendar } from '@/components/ui/calendar';

import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import StoreSwitcher from '@/components/store-switcher';

export default function PenjualanWebsiteTable() {
  let [orders, setOrders] = useState([
    ['Date', 'Total'],
    ['29 05 2024', 'Rp. 12.000.000'],
  ]);

  let [ordersDisplay, setOrdersDisplay] = useState([]);

  let [total, setTotal] = useState(0);
  let [totalDisplay, setTotalDisplay] = useState(0);

  let [store, setStore] = useState([]);
  let [storeDisplay, setStoreDisplay] = useState([]);

  let [startAt, setStartAt] = useState<Date | undefined>(new Date());
  let [endAt, setEndAt] = useState<Date | undefined>(new Date());

  useEffect(() => {
    let fetch = async () => {
      let response = await axios.get('/api/reports/penjualan/website');

      let storeResponse = await axios.get('/api/reports/penjualan/website/all');

      let { data } = response;

      let store = storeResponse.data;

      setStore(store);
      setStoreDisplay(store);

      let total = 0;

      // @ts-ignore
      store.forEach((e) => {
        total += Number(e.total) - Number(e.discount);
      });

      setTotal(total);
      setTotalDisplay(total);

      console.log(data);

      let orderData = [];

      orderData.push(['Date', 'Total']);

      let keys = Object.keys(data);

      keys.sort((a, b) => {
        return isBefore(
          parse(b, 'dd MM yyyy', new Date()),
          parse(a, 'dd MM yyyy', new Date()),
        )
          ? 1
          : -1;

        return 0;
      });

      for (const key of keys) {
        orderData.push([key, data[key]]);
      }

      setOrders(orderData);

      // @ts-ignore
      setOrdersDisplay(orderData);
    };

    fetch();
  }, []);

  return (
    <>
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
              onClick={() => {
                const prepareWebsite = () => {
                  // @ts-ignore
                  let data = [];

                  // @ts-ignore
                  data.push(['Date', 'Total']);

                  orders.forEach((e) => {
                    if (
                      isWithinInterval(parse(e[0], 'dd MM yyyy', new Date()), {
                        start: startAt!,
                        end: endAt!,
                      })
                    ) {
                      data.push(e);
                    }
                  });

                  // @ts-ignore
                  setOrdersDisplay(data);
                };

                const prepareTable = () => {
                  // @ts-ignore
                  let data = [];
                  let total = 0;

                  store.forEach((e) => {
                    // @ts-ignore
                    if (
                      // @ts-ignore
                      isWithinInterval(e.createdAt, {
                        start: startAt!,
                        end: endAt!,
                      })
                    ) {
                      data.push(e);

                      // @ts-ignore
                      total += Number(e.total) - Number(e.discount);
                    }
                  });

                  // @ts-ignore
                  setStoreDisplay(data);
                  setTotalDisplay(total);
                };

                prepareWebsite();
                prepareTable();
              }}
            >
              Set Period
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex gap-3">
              Penjualan Website Table - {`[${formatter.format(totalDisplay)}]`}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-primary-foreground">
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Sub Total</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Grand Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeDisplay.map((e) => {
                return (
                  <TableRow>
                    {/* @ts-ignore */}
                    <TableCell>{e.id}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{format(e.createdAt, 'dd-MM-yyyy')}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{formatter.format(e.total)}</TableCell>
                    {/* @ts-ignore */}
                    <TableCell>{formatter.format(e.discount)}</TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      {formatter.format(e.total - e.discount)}
                    </TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      <Badge>{e.status}</Badge>
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
