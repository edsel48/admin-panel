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
import { DataTable } from '@/components/ui/data-table';

import { SupplierColumn } from './columns';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import {
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
  Box,
  DollarSign,
} from 'lucide-react';

import { NotebookTabs } from 'lucide-react';

import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertModal } from '@/components/modals/alert-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Product } from '@prisma/client';
import { formatter } from '@/lib/utils';
import { format } from 'date-fns';

interface CellActionProps {
  data: SupplierColumn;
}

interface ProductOnSupplierColumn {
  name: string;
  createdAt: string;
}

interface TransactionOnSupplierColumn {
  id: string;
  grandTotal: string;
  status: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);

    toast.success('Supplier ID copied to the clipboard.');
  };

  const productOnSupplierColumn: ColumnDef<ProductOnSupplierColumn>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
    },
  ];

  const formattedProductOnSupplier = data.products.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }));

  const formattedTransactionOnSupplier = data.transactions.map((item) => ({
    id: item.id,
    grandTotal: formatter.format(Number(item.grandTotal)),
    status: item.status,
  }));

  const transactionOnSupplierColumn: ColumnDef<TransactionOnSupplierColumn>[] =
    [
      {
        accessorKey: 'id',
        header: 'ID',
      },
      {
        accessorKey: 'grandTotal',
        header: 'Total',
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        id: 'action',
        cell: ({ row }) => (
          <>
            <Button
              onClick={() => {
                router.push(
                  `/${params.storeId}/suppliers/${data.id}/transactions/${row.original.id}`,
                );
              }}
            >
              Detail
            </Button>
          </>
        ),
      },
    ];

  const [state, setState] = useState<string>('PRODUCT');

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/suppliers/${data.id}`);

      router.refresh();

      toast.success('Supplier deleted.');
    } catch (error) {
      toast.error(
        'Make sure you removed all product using this supplier first.',
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

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
              <Box className="mr-2 h-4 w-4" />
              <DialogTrigger
                onClick={() => {
                  setState('PRODUCT');
                }}
              >
                Products
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <NotebookTabs className="mr-2 h-4 w-4" />
              <DialogTrigger
                onClick={() => {
                  setState('TRANSACTIONS');
                }}
              >
                Transactions
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onCopy(data.id);
              }}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Id
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(`/${params.storeId}/suppliers/${data.id}`)
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                console.log(
                  `/${params.storeId}/suppliers/${data.id}/transactions`,
                );
                router.push(
                  `/${params.storeId}/suppliers/${data.id}/transactions`,
                );
              }}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Create Transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {state == 'PRODUCT' ? (
                  <>Products From {data.name}</>
                ) : (
                  <>Transaction Lists from {data.name}</>
                )}
              </DialogTitle>
              <DialogDescription className="text-black">
                <ScrollArea className="h-[500px] w-full p-2">
                  {state == 'PRODUCT' ? (
                    <DataTable
                      columns={productOnSupplierColumn}
                      data={formattedProductOnSupplier}
                      searchKey="name"
                    />
                  ) : (
                    <DataTable
                      columns={transactionOnSupplierColumn}
                      // @ts-ignore
                      data={formattedTransactionOnSupplier}
                      searchKey="id"
                    />
                  )}
                </ScrollArea>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </DropdownMenu>
    </>
  );
};
