import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';
import axios from 'axios';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: { productId: string } },
) {
  try {
    console.log('fetched');
    console.log(`${process.env.PREDICTION_API_ENDPOINT!}/format`);

    const response = await axios.post(
      `${process.env.PREDICTION_API_ENDPOINT!}/format`,
    );
    const data = response.data.data;

    let algorithm = 'arima';
    let isVerbose = false;
    let start = 50;
    let end = 55;

    console.log(data);

    // build the endpoint
    let endpoint = `${process.env.PREDICTION_API_ENDPOINT!}/predict/${isVerbose ? `verbose/${algorithm}` : `${algorithm}`}`;

    console.log(endpoint);

    const output = await axios.post(endpoint, {
      start,
      end,
      sold_data: data,
    });

    return NextResponse.json({
      ...output.data,
      data: data,
    });
  } catch (error) {
    console.log('[PREDICT_POST]', error);

    return new NextResponse('Internal error', { status: 500 });
  }
}
