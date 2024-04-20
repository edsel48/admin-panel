'use client';

import { Chart } from 'react-google-charts';

import axios from 'axios';
import { addDays, format, subDays } from 'date-fns';

import { useState, useEffect } from 'react';

export const options = {
  animation: {
    duration: 200,
    easing: 'linear',
    startup: true,
  },
  explorer: {
    keepInBounds: true,
    maxZoomIn: 12.0,
  },
  title: 'Sales Prediction',
  curveType: 'function',
  legend: { position: 'bottom' },
};

export default function LineChart() {
  console.log('calling linechart');
  const [data, setData] = useState([
    ['dates', 'predicted', 'actual'],
    ['SEP 01', 154.98, 165],
    ['SEP 02', 157.98, 168],
    ['SEP 03', 160.99, 171],
    ['SEP 04', 163.99, 174],
    ['SEP 05', 166.99, 177],
  ]);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const arimaData = async () => {
      let start = 20;
      let end = 50;
      let data = await axios.post(
        'https://b45e-180-249-184-164.ngrok-free.app/format',
      );
      setProgress(20);

      let response = await axios.post(
        'https://b45e-180-249-184-164.ngrok-free.app/predict/verbose/arima',
        {
          start,
          end,
          sold_data: data.data.data,
        },
      );
      setProgress(40);

      let response_linear_regression = await axios.post(
        'https://b45e-180-249-184-164.ngrok-free.app/predict/verbose/linear-regression',
        {
          start,
          end,
          sold_data: data.data.data,
        },
      );
      setProgress(60);

      let response_svr = await axios.post(
        'https://b45e-180-249-184-164.ngrok-free.app/predict/verbose/svr',
        {
          start,
          end,
          sold_data: data.data.data,
        },
      );

      const sold_data = data.data.data;
      const predicted_data_arima = response.data.predicted;
      const predicted_data_lr = response_linear_regression.data.predicted.data;
      const predicted_data_svr = response_svr.data.predicted.data;

      let dataset = [];
      const dates = ['SEP 01', 'SEP 02', 'SEP 03', 'SEP 04', 'SEP 05'];
      dataset.push(['dates', 'arima', 'lr', 'svr', 'actual']);
      setProgress(80);

      // actual data how it suppose to be
      for (let i = 0; i < predicted_data_arima.length - 1; i++) {
        dataset.push([
          format(subDays(new Date(), predicted_data_arima.length - i), 'd MMM'),
          0,
          0,
          0,
          sold_data.slice(start, end)[i],
        ]);
      }

      for (let i = 0; i < predicted_data_arima.length - 1; i++) {
        dataset.push([
          format(addDays(new Date(), i + 1), 'd MMM'),
          parseFloat(predicted_data_arima[i].toFixed(2)),
          parseFloat(predicted_data_lr[i].toFixed(2)),
          parseFloat(predicted_data_svr[i].toFixed(2)),
          0,
        ]);
      }

      // // projected data
      // for (let i = 0; i < predicted_data_arima.length - 1; i++) {
      //   dataset.push([
      //     format(addDays(new Date(), i), 'd MMM'),
      //     parseFloat(predicted_data_arima[i].toFixed(2)),
      //     parseFloat(predicted_data_lr[i].toFixed(2)),
      //     parseFloat(predicted_data_svr[i].toFixed(2)),
      //     sold_data.slice(start, end)[i],
      //   ]);
      // }

      setProgress(100);

      setData(dataset);
      setLoading(false);
    };

    arimaData();
  }, []);

  return (
    <>
      <div className="w-full text-center"> {progress} % </div>
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </>
  );
}
