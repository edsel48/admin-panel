'use client';

import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { ProductColumn } from './columns';
import { Button } from '@/components/ui/button';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';

import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertModal } from '@/components/modals/alert-modal';
import { Product, SizesOnProduct } from '@prisma/client';
import prismadb from '@/lib/prismadb';
import { ComboboxPopover } from './size-popover';
import { formatter } from '@/lib/utils';
import useCart from '@/hooks/use-supplier-transaction';

interface CellActionProps {
  data: ProductColumn;
  setProducts: void;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const addItems = useCart((state) => state.addItem);
  const carts = useCart((state) => state.carts);

  const [size, setSize] = useState<SizesOnProduct | null>();
  const [qty, setQty] = useState<number>(0);

  const onChange = (sizeId: string) => {
    let size = data.sizes.find((e) => e.sizeId == sizeId);
    // @ts-ignore
    setSize(size);
    // @ts-ignore
    toast.success(`Changed size to ${size?.size.name}`);
  };

  const inputOnChange = (num: number) => {
    //@ts-ignore
    setQty(num);
    toast.success(`Changed quantity to ${num}`);
  };

  const onClick = () => {
    if (size != null) {
      addItems(data, size, qty, Number(size.price), Number(size.price) * qty);

      console.log(carts);

      // @ts-ignore
      toast.success(
        // @ts-ignore
        `Added product ${data.name} with a size of ${size.size.name} x ${qty}`,
      );
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <Dialog>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <DialogTrigger>Add Product</DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Size & Quantity</DialogTitle>
              <DialogDescription className="text-black">
                {/* later will be filled with products and quantity */}
                {/* @ts-ignore */}
                <div className="flex flex-col gap-5">
                  <ComboboxPopover
                    statuses={data.sizes.map((e) => {
                      return {
                        value: e.sizeId,
                        // @ts-ignore
                        label: e.size.name,
                      };
                    })}
                    // @ts-ignore
                    onChange={onChange}
                  />
                  {/* @ts-ignore */}
                  {size && formatter.format(size.price)}
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="qty">Quantity</Label>
                    <Input
                      type="number"
                      id="qty"
                      placeholder="Quantity"
                      onBlur={(e) => {
                        // @ts-ignore
                        inputOnChange(e.currentTarget.value);
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      onClick();
                    }}
                  >
                    {' '}
                    Add Items{' '}
                  </Button>
                </div>
                {/* later will be adding buttons to add into the data */}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </DropdownMenu>
    </>
  );
};
