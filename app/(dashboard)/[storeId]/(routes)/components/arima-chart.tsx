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
            PIECE: 1,
            'BOX (5)': 5,
            'BOX (10)': 10,
            LUSIN: 12,
            DOZEN: 144,
          };

          if (e.orderItems.length > 10) {
            let endpoint = 'http://localhost:8080/';
            let response = await axios.post(endpoint + 'predict/arima', {
              start: 1,
              end: e.orderItems.length,
              // @ts-ignore
              sold_data: e.orderItems.map(
                // @ts-ignore
                (item) => item.quantity * sizeMap[item.size],
              ),
            });

            let arima_data = response.data.predicted;

            response = await axios.post(
              endpoint + 'predict/linear-regression',
              {
                start: 1,
                end: e.orderItems.length,
                // @ts-ignore
                sold_data: e.orderItems.map(
                  // @ts-ignore
                  (item) => item.quantity * sizeMap[item.size],
                ),
              },
            );

            let linreg_data = response.data.predicted;

            response = await axios.post(endpoint + 'predict/svr', {
              start: 1,
              end: e.orderItems.length,
              // @ts-ignore
              sold_data: e.orderItems.map(
                // @ts-ignore
                (item) => item.quantity * sizeMap[item.size],
              ),
            });

            let svr_data = response.data.predicted;

            let output = [];

            for (let i = e.orderItems.length - 2; i > 0; i--) {
              let date = format(
                addDays(new Date(), e.orderItems.length - 2 - i),
                'dd MM yyyy',
              );
              let arima = arima_data[e.orderItems.length - 2 - i];
              let svr = svr_data[e.orderItems.length - 2 - i];
              let lr = linreg_data[e.orderItems.length - 2 - i];

              console.log({
                date,
                arima,
                svr,
                lr,
              });

              output.push({
                date,
                arima,
                svr,
                lr,
              });

              // @ts-ignore
              setPredictionData(output);
            }
          }
        }}
        product={product}
      />

      {/* @ts-ignore */}
      {product != null ? (
        // @ts-ignore
        product.orderItems != null ? (
          // @ts-ignore
          product.orderItems.length <= 10 ? (
            <div className="font-bold">
              Transaction data doesn't meet the requirements
            </div>
          ) : (
            <>
              <h1 className="text-lg font-bold">
                {/* @ts-ignore */}
                {product.name} Prediction
              </h1>
              <table className="border-1 w-full border-solid text-center">
                {predictionData == null ? (
                  <>Predicting</>
                ) : (
                  <tr>
                    <th>Date</th>
                    <th>ARIMA</th>
                    <th>Linear Regression</th>
                    <th>SVR</th>
                  </tr>
                )}
                {predictionData != null ? (
                  // @ts-ignore
                  predictionData.map((e) => {
                    return (
                      <tr>
                        {/* @ts-ignore */}
                        <td>{e.date}</td>
                        {/* @ts-ignore */}
                        <td>{e.arima} pcs</td>
                        {/* @ts-ignore */}
                        <td>{e.lr} pcs</td>
                        {/* @ts-ignore */}
                        <td>{e.svr} pcs</td>
                      </tr>
                    );
                  })
                ) : (
                  <></>
                )}
              </table>
            </>
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
