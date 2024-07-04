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
import { subWeeks, isWithinInterval } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';

import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';

const CardTotalKeuntungan = ({ keuntungan }: { keuntungan: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Semua Keuntungan</CardTitle>
        <CardDescription>Website dan Cashier</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {/* @ts-ignore */}
          {formatter.format(keuntungan)}
        </p>
      </CardContent>
    </Card>
  );
};

const CartTotalKeuntunganWebsite = ({ keuntungan }: { keuntungan: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Keuntungan Website</CardTitle>
        <CardDescription>Website / Store</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {/* @ts-ignore */}
          {formatter.format(keuntungan)}
        </p>
      </CardContent>
    </Card>
  );
};

const CartTotalKeuntunganCashier = ({ keuntungan }: { keuntungan: number }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Keuntungan Cashier</CardTitle>
        <CardDescription>Cashier</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          {/* @ts-ignore */}
          {formatter.format(keuntungan)}
        </p>
      </CardContent>
    </Card>
  );
};

const StatusButton = ({
  status,
  text,
  onClick,
}: {
  status: string;
  text: string;
  onClick(): void;
}) => {
  if (status == text)
    return (
      <Button
        onClick={() => {
          onClick();
        }}
      >
        {text}
      </Button>
    );

  return (
    <Button
      onClick={() => {
        onClick();
      }}
      variant={'outline'}
    >
      {text}
    </Button>
  );
};

const KeuntunganData = ({
  status,
  keuntungan,
}: {
  status: string;
  keuntungan: number;
}) => {
  let type = 'Hari ini';
  if (status == 'MONTHLY') type = 'Bulan ini';
  if (status == 'WEEKLY') type = 'Minggu ini';
  if (status == 'ANNUALLY') type = 'Tahun ini';

  return (
    <div>
      Keuntungan {type} : {formatter.format(keuntungan)}
    </div>
  );
};

const DateRange = ({ status }: { status: string }) => {
  let dateStart = new Date();
  let dateEnd = new Date();

  if (status == 'DAILY') {
    dateStart = subDays(dateStart, 1);
  }
  if (status == 'WEEKLY') {
    dateStart = subWeeks(dateStart, 1);
  }
  if (status == 'MONTHLY') {
    dateStart = subMonths(dateStart, 1);
  }
  if (status == 'ANNUALLY') {
    dateStart = subYears(dateStart, 1);
  }

  return (
    <p>
      {format(dateStart, 'dd-MM-yyyy HH:mm:ss')} -{' '}
      {format(dateEnd, 'dd-MM-yyyy HH:mm:ss')}
    </p>
  );
};

export default function KeuntunganChart() {
  const [keuntungan, setKeuntungan] = useState(0);
  const [keuntunganWebsite, setKeuntunganWebsite] = useState(0);

  const [orders, setOrders] = useState([]);
  const [periodDisplay, setPeriodDisplay] = useState({});

  const [keuntunganHarian, setKeuntunganHarian] = useState(0);
  const [keuntunganMingguan, setKeuntunganMingguan] = useState(0);
  const [keuntunganBulanan, setKeuntunganBulanan] = useState(0);
  const [keuntunganTahunan, setKeuntunganTahunan] = useState(0);

  const [chartHarian, setChartHarian] = useState([
    ['Hour', 'Total Keuntungan'],
    ['00:00', 0],
    ['02:00', 12000],
  ]);

  const [chartMingguan, setChartMingguan] = useState([
    ['Dates', 'Total Keuntungan'],
    ['04-06-2024', 0],
    ['05-06-2024', 12000],
  ]);

  const [chartBulanan, setChartBulanan] = useState([
    ['Weeks', 'Total Keuntungan'],
    ['Week 1', 0],
    ['Week 2', 12000],
  ]);

  const [chartTahunan, setChartTahunan] = useState([
    ['Months', 'Total Keuntungan'],
    ['Januari', 0],
    ['February', 12000],
  ]);

  const [displayKeuntungan, setDisplayKeuntungan] = useState(0);

  const [chartData, setChartData] = useState([
    ['Time', 'Data'],
    ['01-06-2024', 12000000],
  ]);

  const [profitableProduct, setProfitableProduct] = useState([]);
  const [lessProfitableProduct, setLessProfitableProduct] = useState([]);

  const [status, setStatus] = useState('DAILY');

  const [loading, setLoading] = useState(true);

  const [startAt, setStartAt] = useState<Date | undefined>(new Date());
  const [endAt, setEndAt] = useState<Date | undefined>(new Date());

  useEffect(() => {
    setLoading(true);

    const fetch = async () => {
      let response = await axios.get('/api/reports/keuntungan');
      let { data } = response;

      let orders = await axios.get('/api/reports/keuntungan/total');

      setOrders(orders.data);

      response = await axios.get('/api/reports/keuntungan/store');
      let keuntunganWebsite = response.data;
      setKeuntunganWebsite(keuntunganWebsite);
      setKeuntungan(data);
      setPeriodDisplay({
        website: keuntunganWebsite,
        total: data,
        cashier: data - keuntunganWebsite,
      });

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

      // setting keuntungan based on status
      for (const e of ['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY']) {
        response = await axios.get(`/api/reports/keuntungan/status/${e}`);
        let responseChart = await axios.post('/api/reports/keuntungan/all', {
          type: e,
        });

        let keuntunganChart = responseChart.data;

        let keuntungan = response.data;

        if (e == 'DAILY') {
          setKeuntunganHarian(keuntungan);
          setDisplayKeuntungan(keuntungan);
          setChartHarian(keuntunganChart);
          setChartData(keuntunganChart);
        }
        if (e == 'WEEKLY') {
          setKeuntunganMingguan(keuntungan);
          setChartMingguan(keuntunganChart);
        }
        if (e == 'MONTHLY') {
          setKeuntunganBulanan(keuntungan);
          setChartBulanan(keuntunganChart);
        }
        if (e == 'ANNUALLY') {
          setKeuntunganTahunan(keuntungan);
          setChartTahunan(keuntunganChart);
        }
      }
    };

    fetch();
    setLoading(false);
  }, []);

  return loading ? (
    <>Fetching data please wait</>
  ) : (
    <div className="h-full flex-col gap-5">
      <div className="flex-col items-center gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Laporan Keuntungan Per Periode</CardTitle>
            <CardContent>
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
                        let website = 0;
                        let all = 0;

                        orders.forEach((e) => {
                          if (
                            // @ts-ignore
                            isWithinInterval(e.createdAt, {
                              start: startAt,
                              end: endAt,
                            })
                          ) {
                            // @ts-ignore
                            if (e.type === 'STORE') {
                              // @ts-ignore
                              website += e.grandTotal;
                            }

                            // @ts-ignore
                            all += e.grandTotal;
                          }
                        });

                        setPeriodDisplay({
                          total: all * (1 - (1 - 0.175)),
                          website: website * (1 - (1 - 0.175)),
                          cashier: (all - website) * (1 - (1 - 0.175)),
                        });
                      }}
                    >
                      Set Period
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Laporan Keuntungan per Periode</CardTitle>
            <CardContent>
              <div className="flex gap-3">
                {/* @ts-ignore */}
                <CardTotalKeuntungan keuntungan={periodDisplay['total'] || 0} />
                <CartTotalKeuntunganWebsite
                  // @ts-ignore
                  keuntungan={periodDisplay['website'] || 0}
                />
                <CartTotalKeuntunganCashier
                  // @ts-ignore
                  keuntungan={periodDisplay['cashier'] || 0}
                />
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
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
      <div className="mt-3 flex w-full flex-1 gap-3">
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex gap-x-3">
                  {['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY'].map((e) => (
                    <StatusButton
                      onClick={() => {
                        setStatus(e);

                        if (e == 'DAILY') {
                          setDisplayKeuntungan(keuntunganHarian);
                          setChartData(chartHarian);
                        }
                        if (e == 'WEEKLY') {
                          setDisplayKeuntungan(keuntunganMingguan);
                          setChartData(chartMingguan);
                        }
                        if (e == 'MONTHLY') {
                          setDisplayKeuntungan(keuntunganBulanan);
                          setChartData(chartBulanan);
                        }
                        if (e == 'ANNUALLY') {
                          setDisplayKeuntungan(keuntunganTahunan);
                          setChartData(chartTahunan);
                        }
                      }}
                      text={e}
                      status={status}
                    />
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>
                <KeuntunganData
                  status={status}
                  keuntungan={displayKeuntungan}
                />
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="mt-3 flex-col">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex gap-3">
                <p>Keuntungan ({status}) : </p> <DateRange status={status} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              chartType="LineChart"
              width="100%"
              height="325px"
              data={chartData}
              options={{
                animation: {
                  duration: 200,
                  easing: 'linear',
                  startup: true,
                },
                explorer: {
                  keepInBounds: true,
                  maxZoomIn: 12.0,
                },
                legend: { position: 'bottom' },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
