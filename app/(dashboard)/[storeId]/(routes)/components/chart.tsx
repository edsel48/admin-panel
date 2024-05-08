'use client';

import { Chart } from 'react-google-charts';

import axios from 'axios';
import { addDays, format, subDays } from 'date-fns';

import toast from 'react-hot-toast';

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
      try {
        let start = 20;
        let end = 50;

        let endpoint = 'http://localhost:8080';

        let data = await axios.post(endpoint + '/format');
        setProgress(20);

        let response = await axios.post(endpoint + '/predict/verbose/arima', {
          start,
          end,
          sold_data: data.data.data,
        });
        setProgress(40);

        let response_linear_regression = await axios.post(
          endpoint + '/predict/verbose/linear-regression',
          {
            start,
            end,
            sold_data: data.data.data,
          },
        );
        setProgress(60);

        let response_svr = await axios.post(endpoint + '/predict/verbose/svr', {
          start,
          end,
          sold_data: data.data.data,
        });

        const sold_data = data.data.data;
        const predicted_data_arima = response.data.predicted;
        const predicted_data_lr =
          response_linear_regression.data.predicted.data;
        const predicted_data_svr = response_svr.data.predicted.data;

        let dataset = [];
        const dates = ['SEP 01', 'SEP 02', 'SEP 03', 'SEP 04', 'SEP 05'];
        dataset.push(['dates', 'arima', 'lr', 'svr', 'actual']);
        setProgress(80);

        // // actual data how it suppose to be
        // for (let i = 0; i < predicted_data_arima.length - 1; i++) {
        //   dataset.push([
        //     format(subDays(new Date(), predicted_data_arima.length - i), 'd MMM'),
        //     0,
        //     0,
        //     0,
        //     sold_data.slice(start, end)[i],
        //   ]);
        // }

        // for (let i = 0; i < predicted_data_arima.length - 1; i++) {
        //   dataset.push([
        //     format(addDays(new Date(), i + 1), 'd MMM'),
        //     parseFloat(predicted_data_arima[i].toFixed(2)),
        //     parseFloat(predicted_data_lr[i].toFixed(2)),
        //     parseFloat(predicted_data_svr[i].toFixed(2)),
        //     0,
        //   ]);
        // }

        // projected data
        for (let i = 0; i < predicted_data_arima.length - 1; i++) {
          dataset.push([
            format(addDays(new Date(), i), 'd MMM'),
            parseFloat(predicted_data_arima[i].toFixed(2)),
            parseFloat(predicted_data_lr[i].toFixed(2)),
            parseFloat(predicted_data_svr[i].toFixed(2)),
            sold_data.slice(start, end)[i],
          ]);
        }

        setProgress(100);

        setData(dataset);
        setLoading(false);
      } catch (e) {
        toast.error(
          'Fetching data error, please check your connection to your API',
        );
      }
    };

    arimaData();
  }, []);

  return (
    <>
      <div className="flex w-full flex-col gap-5">
        <div className="w-full text-center"> {progress} % </div>
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />

        <table className="border-1 w-full border-solid text-center">
          <tr>
            <th>Date</th>
            <th>ARIMA</th>
            <th>Linear Regression</th>
            <th>SVR</th>
            <th>Actual</th>
          </tr>
          {progress == 100 &&
            data.map((e, i) => {
              if (i != 0) {
                return (
                  <tr>
                    <td>{e[0]}</td>
                    <td>{Math.round(e[1] / 1000)} pcs</td>
                    <td>{Math.round(e[2] / 1000)} pcs </td>
                    <td>{Math.round(e[3] / 1000)} pcs </td>
                    <td>{Math.round(e[4] / 1000)} pcs </td>
                  </tr>
                );
              }
            })}
        </table>
      </div>
    </>
  );
}
