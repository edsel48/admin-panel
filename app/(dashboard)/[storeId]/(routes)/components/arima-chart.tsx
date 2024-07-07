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

  let [arimaTotal, setArimaTotal] = useState(0);
  let [lrTotal, setLrTotal] = useState(0);
  let [svrTotal, setSvrTotal] = useState(0);

  useEffect(() => {
    // fetching all product data
    const fetchProduct = async () => {
      let response = await axios.get('/api/reports/product');

      let { data } = response;

      setProductsData(data);
      setProduct(data[0]);
    };

    fetchProduct();
  }, []);

  return (
    <div className="flex-col gap-5">
      <div className="text-xl font-bold">Arima Chart</div>
      <Dropdown
        data={productsData}
        // @ts-ignore
        setProduct={async (e) => {
          // @ts-ignore
          setProduct(e);
          //   @ts-ignore
          setTransaction(e.orderItems);

          console.log(e.orderItems);

          let sizeMap = {
            Piece: 1,
            'Box (5)': 5,
            'Box (10)': 10,
            Lusin: 12,
            Gross: 144,
          };

          let endpoint = 'https://221e-36-74-147-194.ngrok-free.app/';
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
              'dd MM yyyy',
            );
            let arima = arima_data[e.orderItems.length - 2 - i];
            let svr = svr_data[e.orderItems.length - 2 - i];
            let lr = linreg_data[e.orderItems.length - 2 - i];

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
          setArimaTotal(currentArima);
          setSvrTotal(currentSvr);
          setLrTotal(currentLr);
        }}
        product={product}
      />

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
                        <TableHead>ARIMA - [ {arimaTotal} pcs ]</TableHead>
                        <TableHead>
                          Linear Regression - [ {lrTotal} pcs ]
                        </TableHead>
                        <TableHead>SVR - [ {svrTotal} pcs ] </TableHead>
                      </TableRow>
                    </TableHeader>
                    {predictionData != null ? (
                      // @ts-ignore
                      predictionData.map((e) => {
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
