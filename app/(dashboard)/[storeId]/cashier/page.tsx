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
