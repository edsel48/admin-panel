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

import { formatter } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { parse } from 'date-fns';
import { subWeeks } from 'date-fns';

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

  const [keuntunganHarian, setKeuntunganHarian] = useState(0);
  const [keuntunganMingguan, setKeuntunganMingguan] = useState(0);
  const [keuntunganBulanan, setKeuntunganBulanan] = useState(0);
  const [keuntunganTahunan, setKeuntunganTahunan] = useState(0);

  const [displayKeuntungan, setDisplayKeuntungan] = useState(0);

  const [dataKeuntungan, setDataKeuntungan] = useState({
    DAILY: 0,
    WEEKLY: 0,
    MONTHLY: 0,
    ANNUALLY: 0,
  });

  const [chartData, setChartData] = useState([
    ['Time', 'Data'],
    ['01-06-2024', 12000000],
  ]);

  const [status, setStatus] = useState('DAILY');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const fetch = async () => {
      let response = await axios.get('/api/reports/keuntungan');
      let { data } = response;

      response = await axios.get('/api/reports/keuntungan/store');
      let keuntunganWebsite = response.data;
      setKeuntunganWebsite(keuntunganWebsite);
      setKeuntungan(data);

      // setting keuntungan based on status
      for (const e of ['DAILY', 'WEEKLY', 'MONTHLY', 'ANNUALLY']) {
        response = await axios.get(`/api/reports/keuntungan/status/${e}`);

        let keuntungan = response.data;

        if (e == 'DAILY') {
          setKeuntunganHarian(keuntungan);
          setDisplayKeuntungan(keuntungan);
          setDataKeuntungan({
            DAILY: Number(keuntungan),
            WEEKLY: dataKeuntungan['WEEKLY'],
            MONTHLY: dataKeuntungan['MONTHLY'],
            ANNUALLY: dataKeuntungan['ANNUALLY'],
          });
        }
        if (e == 'WEEKLY') {
          setKeuntunganMingguan(keuntungan);
          setDataKeuntungan({
            WEEKLY: Number(keuntungan),
            DAILY: dataKeuntungan['DAILY'],
            MONTHLY: dataKeuntungan['MONTHLY'],
            ANNUALLY: dataKeuntungan['ANNUALLY'],
          });
        }
        if (e == 'MONTHLY') {
          setKeuntunganBulanan(keuntungan);
          setDataKeuntungan({
            MONTHLY: Number(keuntungan),
            DAILY: dataKeuntungan['DAILY'],
            WEEKLY: dataKeuntungan['WEEKLY'],
            ANNUALLY: dataKeuntungan['ANNUALLY'],
          });
        }
        if (e == 'ANNUALLY') {
          setKeuntunganTahunan(keuntungan);
          setDataKeuntungan({
            ANNUALLY: Number(keuntungan),
            DAILY: dataKeuntungan['DAILY'],
            WEEKLY: dataKeuntungan['WEEKLY'],
            MONTHLY: dataKeuntungan['MONTHLY'],
          });
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
      <div className="flex flex-1 items-center justify-between gap-3">
        <CardTotalKeuntungan keuntungan={keuntungan} />
        <CartTotalKeuntunganWebsite keuntungan={keuntunganWebsite} />
        <CartTotalKeuntunganCashier
          keuntungan={keuntungan - keuntunganWebsite}
        />
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
                        // change chart data from here
                        setChartData([
                          ['Time', 'Data'],
                          ['01-06-2024 10:00', 25000000],
                          ['01-06-2024 11:00', 22000000],
                          ['01-06-2024 12:00', 212000000],
                          ['01-06-2024 13:00', 252300000],
                          ['01-06-2024 14:00', 24455000000],
                          ['01-06-2024 15:00', 252330000],
                        ]);

                        if (e == 'DAILY') {
                          setDisplayKeuntungan(keuntunganHarian);
                        }
                        if (e == 'WEEKLY') {
                          setDisplayKeuntungan(keuntunganMingguan);
                        }
                        if (e == 'MONTHLY') {
                          setDisplayKeuntungan(keuntunganBulanan);
                        }
                        if (e == 'ANNUALLY') {
                          setDisplayKeuntungan(keuntunganTahunan);
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
