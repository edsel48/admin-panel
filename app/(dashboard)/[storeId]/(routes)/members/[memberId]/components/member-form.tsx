'use client';

import * as z from 'zod';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Member } from '@prisma/client';
import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AlertModal } from '@/components/modals/alert-modal';
import { Checkbox } from '@/components/ui/checkbox';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

const formSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(1),
  email: z.string().min(1),
  status: z.boolean().default(false).optional(),
  type: z.string().min(1),
  tier: z.string().min(1),
});

type MemberFormValues = z.infer<typeof formSchema>;

interface MemberFormProps {
  initialData: Member | null;
}

export const MemberForm: React.FC<MemberFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const origin = useOrigin();

  const title = initialData ? 'Edit member' : 'Create member';
  const description = initialData ? 'Edit a member' : 'Add a new member';
  const toastMessage = initialData ? 'Member updated!' : 'Member created!';
  const action = initialData ? 'Save changes' : 'Create';

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(formSchema),
    // @ts-ignore
    defaultValues: initialData || {
      name: '',
      username: '',
      status: false,
      email: '',
      type: '',
      tier: '',
    },
  });

  const onSubmit = async (data: MemberFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/members/${params.memberId}`,
          data,
        );
      } else {
        await axios.post(`/api/${params.storeId}/members`, data);
      }

      router.refresh();
      router.push(`/${params.storeId}/members`);

      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/members/${params.memberId}`);

      router.refresh();
      router.push(`/${params.storeId}/members`);

      toast.success('Member deleted.');
    } catch (error) {
      toast.error('Make sure you removed all product in this member');
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

      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="sm"
            disabled={loading}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="member name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="member username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="member email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>type</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="Member Type"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="space-y- flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Status</FormLabel>
                    <FormDescription>Status of the member</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
