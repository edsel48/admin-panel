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

  return (
    <>

    </>
  );
};

export default CellAction;
