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

import { Button } from '@/components/ui/button';
import { Box, Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';

import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertModal } from '@/components/modals/alert-modal';
import {
  Product,
  SizesOnProduct,
  SupplierTransactionItem,
} from '@prisma/client';
import prismadb from '@/lib/prismadb';
import { formatter } from '@/lib/utils';
import useTransaction from '@/hooks/use-transaction';
import dynamic from 'next/dynamic';

interface CellActionProps {
  data: SupplierTransactionItem;
}

// @ts-ignore
const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  let [quantity, setQuantity] = useState<number>();

  const inputOnChange = (num: number) => {
    if (num != null) {
      let value = num;

      if (num >= Number(data.quantity)) {
        value = Number(data.quantity);
      }

      setQuantity(value);
      toast.success(`Updated quantity to ${value}`);
    }
  };

  const onSubmit = async () => {
    try {
      console.log(data.id);
      await axios.patch(
        `/api/${params.storeId}/suppliers/${params.supplierId}/transactions/${params.transactionId}/detail/${data.id}`,
        {
          quantity,
        },
      );
    } catch (e) {
      // @ts-ignore
      console.error(e);
      // @ts-ignore
      toast.error(e.response.data);
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
              <DialogTrigger className="flex items-center gap-3">
                <Box />
                Update Delivered
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delivered Products</DialogTitle>
              <DialogDescription className="text-black">
                <div className="mt-3 flex-col gap-5">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="qty">Quantity</Label>
                    <Input
                      type="number"
                      id="qty"
                      placeholder="Quantity"
                      onBlur={(e) => {
                        // @ts-ignore
                        if (e.currentTarget.value != '') {
                          inputOnChange(Number(e.currentTarget.value));
                        }
                      }}
                      value={quantity}
                      max={Number(data.quantity)}
                      min={0}
                    />
                  </div>
                  <div className="mt-5">
                    <Button
                      onClick={async () => {
                        await onSubmit();
                      }}
                    >
                      Update
                    </Button>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
