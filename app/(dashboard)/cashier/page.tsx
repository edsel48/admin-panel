'use server';

import prismadb from '@/lib/prismadb';
import { ProductClient } from './components/client';
import { ProductColumn } from './components/columns';
import { ColumnDef } from '@tanstack/react-table';

import { format } from 'date-fns';
import { formatter } from '@/lib/utils';
import { Product } from '@prisma/client';

import { useParams, useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';

import { DataTable } from '@/components/ui/data-table';

interface CellActionProps {
  data: Product;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
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

                {/* later will be adding buttons to add into the data */}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </DropdownMenu>
    </>
  );
};

const cashierColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
];

const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    id: 'actions',
    // @ts-ignore
    // cell: ({ row }) => <Button />,
  },
];

const calculateTotal = (products) => {
  let total = 0;

  products.forEach((e) => {
    total += e.subtotal;
  });

  return total;
};

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      sizes: {
        include: {
          product: true,
          size: true,
        },
      },
      suppliers: {
        include: {
          supplier: true,
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={products} />
      </div>
    </div>
  );
};

export default ProductsPage;
