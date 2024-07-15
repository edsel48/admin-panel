// @ts-nocheck
'use client';

import { Chart } from 'react-google-charts';

import { options } from './chart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatter } from '@/lib/utils';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

import { format, subDays, addDays } from 'date-fns';
import toast from 'react-hot-toast';

// @ts-ignore
function Dropdown({ data, product, setProduct }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{product.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Products</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={product} onValueChange={setProduct}>
          {/* @ts-ignore */}
          {data.map((item) => (
            <DropdownMenuRadioItem value={item} key={item.id}>
              {item.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ArimaChart() {
  let [productsData, setProductsData] = useState([]);
  let [product, setProduct] = useState({});
  let [transaction, setTransaction] = useState({});
  let [predictionData, setPredictionData] = useState(null);
  let [predictionDisplay, setPredictionDisplay] = useState(null);

  let [transactionData, setTransactionData] = useState([]);
  let [transactionDataDisplay, setTransactionDataDisplay] = useState([]);

  let [arimaTotal, setArimaTotal] = useState(0);
  let [lrTotal, setLrTotal] = useState(0);
  let [svrTotal, setSvrTotal] = useState(0);

  let [arimaTotalDisplay, setArimaTotalDisplay] = useState(0);
  let [lrTotalDisplay, setLrTotalDisplay] = useState(0);
  let [svrTotalDisplay, setSvrTotalDisplay] = useState(0);

  // @ts-ignore
  const doPredict = async (e) => {
    //   @ts-ignore
    setTransaction(e.orderItems);

    // @ts-ignore
    setPredictionData([]);
    setArimaTotal(0);
    setSvrTotal(0);
    setLrTotal(0);

    let sizeMap = {
      Piece: 1,
      'Box (5)': 5,
      'Box (10)': 10,
      Lusin: 12,
      Gross: 144,
    };

    let endpoint = 'https://06bf-114-10-156-244.ngrok-free.app/';
    let response = await axios.post(endpoint + 'predict/arima', {
      start: 1,
      end: e.orderItems.length,
      // @ts-ignore
      sold_data: e.orderItems.map(
        // @ts-ignore
        (item) => item.quantity * (sizeMap[item.size] || 1),
      ),
    });

    let arima_data = response.data.predicted;

    response = await axios.post(endpoint + 'predict/linear-regression', {
      start: 1,
      end: e.orderItems.length,
      // @ts-ignore
      sold_data: e.orderItems.map(
        // @ts-ignore
        (item) => item.quantity * (sizeMap[item.size] || 1),
      ),
    });

    let linreg_data = response.data.predicted;

    response = await axios.post(endpoint + 'predict/svr', {
      start: 1,
      end: e.orderItems.length,
      // @ts-ignore
      sold_data: e.orderItems.map(
        // @ts-ignore
        (item) => item.quantity * (sizeMap[item.size] || 1),
      ),
    });

    let svr_data = response.data.predicted;

    let output = [];

    let currentArima = 0;
    let currentLr = 0;
    let currentSvr = 0;

    for (let i = e.orderItems.length - 2; i > 0; i--) {
      let date = format(
        addDays(new Date(), e.orderItems.length - 2 - i),
        'dd-MM-yyyy',
      );

      let arima =
        arima_data[e.orderItems.length - 2 - i] > 0
          ? arima_data[e.orderItems.length - 2 - i]
          : 0;
      let svr =
        svr_data[e.orderItems.length - 2 - i] > 0
          ? svr_data[e.orderItems.length - 2 - i]
          : 0;
      let lr =
        linreg_data[e.orderItems.length - 2 - i] > 0
          ? linreg_data[e.orderItems.length - 2 - i]
          : 0;

      currentArima += Number(arima);
      currentSvr += Number(svr);
      currentLr += Number(lr);

      output.push({
        date,
        arima,
        svr,
        lr,
      });
    }
    // @ts-ignore
    setPredictionData(output);
    // @ts-ignore
    setPredictionDisplay(output);

    setArimaTotal(currentArima);
    setSvrTotal(currentSvr);
    setLrTotal(currentLr);

    setArimaTotalDisplay(currentArima);
    setSvrTotalDisplay(currentSvr);
    setLrTotalDisplay(currentLr);
  };

  useEffect(() => {
    // fetching all product data
    const fetchProduct = async () => {
      let response = await axios.get('/api/reports/product');

      let { data } = response;

      setProductsData(data);
      setProduct(data[0]);

      await doPredict(data[0]);
    };

    const fetchTransactionData = async () => {
      let response = await axios.get('/api/reports/transaction');

      let { data } = response;

      setTransactionData(data);
    };

    try {
      fetchProduct();
    } catch (e) {
      toast.error('Error Fetching Data');
    }

    try {
      fetchTransactionData();
    } catch (e) {
      toast.error('Error Fetching Data');
    }
  }, []);

  const PredictionButtons = ({ data }: { data: [] }) => {
    let items = [];

    if (data.length >= 7) {
      let now = (data || []).slice(0, 7);
      let currentArima = 0;
      let currentLr = 0;
      let currentSvr = 0;

      now.forEach((d) => {
        // @ts-ignore
        currentArima += d.arima;
        // @ts-ignore
        currentLr += d.lr;
        // @ts-ignore
        currentSvr += d.svr;
      });

      items.push(
        <Button
          onClick={() => {
            // @ts-ignore
            setPredictionDisplay(now);

            setArimaTotalDisplay(currentArima);
            setSvrTotalDisplay(currentSvr);
            setLrTotalDisplay(currentLr);
          }}
        >
          {' '}
          7 Days
        </Button>,
      );
    }
    if (data.length >= 30) {
      let now = (data || []).slice(0, 30);
      let currentArima = 0;
      let currentLr = 0;
      let currentSvr = 0;

      now.forEach((d) => {
        // @ts-ignore
        currentArima += d.arima;
        // @ts-ignore
        currentLr += d.lr;
        // @ts-ignore
        currentSvr += d.svr;
      });

      items.push(
        <Button
          onClick={() => {
            // @ts-ignore
            setPredictionDisplay(now);

            setArimaTotalDisplay(currentArima);
            setSvrTotalDisplay(currentSvr);
            setLrTotalDisplay(currentLr);
          }}
        >
          30 Days{' '}
        </Button>,
      );
    }

    return (
      <div className="flex gap-3">
        {items.map((e) => {
          return e;
        })}
      </div>
    );
  };

  return (
    <div className="flex-col gap-5">
      <div className="text-xl font-bold">
        Arima, Linear Regression and SVR Prediction Data
      </div>
      <Dropdown
        data={productsData}
        // @ts-ignore
        setProduct={async (e) => {
          // @ts-ignore
          setProduct(e);
          await doPredict(e);
        }}
        product={product}
      />

      <div className="my-3 flex justify-between gap-3">
        {/* <pre>{JSON.stringify(product, null, 2)}</pre> */}

        <div className="text-lg font-bold">
          Total Stock : {product.stock} Pcs
        </div>
        <div className="text-lg font-bold">
          Total Transaction Data :{' '}
          {transactionData != null
            ? transactionData.filter((e) => e.name == product.name)[0] != null
              ? transactionData.filter((e) => e.name == product.name)[0]
                  .transaction
              : 0
            : 0}
        </div>
        <div className="text-lg font-bold">
          Total Prediction Data:{' '}
          {transactionData != null
            ? transactionData.filter((e) => e.name == product.name)[0] != null
              ? transactionData.filter((e) => e.name == product.name)[0]
                  .prediction
              : 0
            : 0}
        </div>
      </div>

      <div className="my-3">
        <PredictionButtons data={predictionData || []} />
      </div>

      {/* @ts-ignore */}
      {product != null ? (
        // @ts-ignore
        product.orderItems != null ? (
          // @ts-ignore
          product.orderItems.length <= 0 ? (
            <div className="font-bold">
              Transaction data doesn't meet the requirements
            </div>
          ) : (
            <div className="mt-3">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {/* @ts-ignore */}
                    {product.name} Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader className="bg-primary-foreground">
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>
                          ARIMA - [ {arimaTotalDisplay} pcs ]
                        </TableHead>
                        <TableHead>
                          Linear Regression - [ {lrTotalDisplay} pcs ]
                        </TableHead>
                        <TableHead>SVR - [ {svrTotalDisplay} pcs ] </TableHead>
                      </TableRow>
                    </TableHeader>
                    {predictionDisplay != null ? (
                      // @ts-ignore
                      predictionDisplay.map((e) => {
                        return (
                          <TableRow>
                            {/* @ts-ignore */}
                            <TableCell>{e.date}</TableCell>
                            {/* @ts-ignore */}
                            <TableCell>{e.arima} pcs</TableCell>
                            {/* @ts-ignore */}
                            <TableCell>{e.lr} pcs</TableCell>
                            {/* @ts-ignore */}
                            <TableCell>{e.svr} pcs</TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </Table>
                </CardContent>
              </Card>
            </div>
          )
        ) : (
          <div className="font-bold">Transaction data not found</div>
        )
      ) : (
        <div className="font-bold">Product not found</div>
      )}
    </div>
  );
}
