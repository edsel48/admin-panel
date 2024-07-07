'use client';

import * as z from 'zod';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import toast from 'react-hot-toast';
import axios from 'axios';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { AlertModal } from '@/components/modals/alert-modal';
import React, { useState } from 'react';

import { SizesOnProduct } from '@prisma/client';
import { Input } from '@/components/ui/input';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useParams, useRouter } from 'next/navigation';
import { useOrigin } from '@/hooks/use-origin';

const formSchema = z.object({
  price: z.coerce.number().min(1),
  priceSilver: z.coerce.number().min(1),
  priceGold: z.coerce.number().min(1),
  pricePlatinum: z.coerce.number().min(1),
  stock: z.coerce.number().min(1),
  weight: z.coerce.number().min(1),
});

export interface SizesPrices {
  id: string;
  name: string;
  price: number;
  priceSilver: number;
  priceGold: number;
  pricePlatinum: number;
  stock: number;
  weight: number;
}

type PriceFormValues = z.infer<typeof formSchema>;

interface PriceFormProps {
  initialData: SizesPrices | null;
}

export const PriceForm: React.FC<PriceFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const origin = useOrigin();

  const form = useForm<PriceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      id: '',
      name: '',
      price: 0,
      priceSilver: 0,
      priceGold: 0,
      pricePlatinum: 0,
      stock: 0,
      weight: 0,
    },
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: PriceFormValues) => {
    try {
      setLoading(true);

      if (initialData == null) return toast.error('error');

      await axios.patch(`/api/product-size/${initialData.id}`, data);

      toast.success(`Success Update for ${initialData.name}`);
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          {/* @ts-ignore */}
          <Heading title={initialData.name} description={''} />
          <Separator />
          <div className=" grid grid-cols-8 items-center gap-5">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="1000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceSilver"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price for Silver Member</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="1000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priceGold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price for Gold</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="1000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePlatinum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price for Platinum</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="1000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (gram) </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      type="number"
                      placeholder="500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} className="ml-auto" type="submit">
              Update
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
