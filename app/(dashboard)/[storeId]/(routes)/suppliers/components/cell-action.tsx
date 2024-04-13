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

import { SupplierColumn } from './columns';
import { Button } from '@/components/ui/button';
import { Copy, Edit, MoreHorizontal, Trash, Box } from 'lucide-react';

import { toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertModal } from '@/components/modals/alert-modal';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CellActionProps {
  data: SupplierColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);

    toast.success('Supplier ID copied to the clipboard.');
  };

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
              <DialogTrigger>Products</DialogTrigger>
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
          </DropdownMenuContent>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Products From {data.name}</DialogTitle>
              <DialogDescription>
                <ScrollArea className="h-[200px] w-full">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptate quibusdam fugiat delectus accusantium, dolor
                  perspiciatis aspernatur voluptas expedita cupiditate eos
                  aperiam excepturi perferendis, tempore numquam repellendus
                  similique minima tenetur fugit. Inventore voluptas minima
                  cupiditate voluptatibus, eligendi exercitationem dignissimos,
                  sequi aspernatur voluptate architecto, culpa dicta. Nihil
                  alias aliquid sed magni harum distinctio asperiores, sint,
                  sapiente earum impedit, consequatur dolorum. Numquam, nulla?
                  Blanditiis non expedita quidem alias ut provident voluptate!
                  Amet exercitationem fuga dolor expedita est, iure modi
                  recusandae consequatur tempora quaerat corporis nihil aliquam
                  sit nostrum reprehenderit animi quae voluptatem enim?
                  Accusamus expedita autem molestiae rem, mollitia fuga debitis
                  accusantium! Odit qui ratione repellendus quos distinctio
                  voluptas consequatur, numquam neque voluptatem ipsa, in
                  molestias voluptatum eum officia molestiae! Optio, nam
                  repudiandae! Non eaque libero earum tenetur alias adipisci
                  ipsam! Impedit similique dolores nam quod numquam! Excepturi
                  sequi ad soluta recusandae, et labore, eius esse aperiam omnis
                  perferendis culpa! Aliquam, dolor iusto. Fuga iusto cumque
                  expedita obcaecati facere, cupiditate officia praesentium ipsa
                  minus illo sapiente. Voluptatem eius illo pariatur maiores
                  animi suscipit nam optio exercitationem culpa perferendis.
                  Animi nemo vel reprehenderit quibusdam? Eum laudantium sit,
                  vitae modi quaerat voluptatem animi, eligendi iusto dolores,
                  eius similique aliquid minus! Nostrum, quod? Laborum
                  repudiandae officiis molestiae itaque ipsa, porro voluptatum
                  id, dignissimos, quidem inventore quis. Vero sapiente nam, non
                  neque omnis animi aliquid ratione eaque ipsam quisquam ad
                  natus doloremque commodi nemo recusandae dolores nulla tenetur
                  molestiae provident ex? Facere quisquam temporibus sunt
                  pariatur impedit! Maiores nulla veritatis vel molestiae
                  eveniet, assumenda corrupti ab esse illum quod hic repudiandae
                  modi cum iure totam accusantium quae dolore debitis illo
                  harum. Minus neque excepturi laboriosam ullam rerum! Veniam,
                  natus vel possimus eveniet fugiat provident dolore placeat ex
                  modi sit officia ullam sunt eius enim maxime cumque ducimus
                  sequi magni asperiores, error consequuntur similique magnam
                  itaque. Error, vero?
                </ScrollArea>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </DropdownMenu>
    </>
  );
};
