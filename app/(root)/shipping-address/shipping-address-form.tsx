'use client';

import { Button } from '@/components/ui/button';
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { updateUserAddress } from '@/lib/actions/user.actions';
import { shippingAddressSchema } from '@/lib/validators';
import { shippingAddressType } from '@/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, LoaderIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';

const shippingDefault = {
  fullName: 'Mark Smith',
  streetAddress: 'Yokohama Street',
  city: 'Tokyo',
  postalCode: '123567',
  country: 'Japan',
};
export const ShippingAddressForm = ({ address }: { address: shippingAddressType }) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingDefault,
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof shippingAddressSchema>) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success)
        toast({
          variant: 'destructive',
          description: res.message,
        });

      toast({
        description: res.message,
      });

      router.push('/payment-method');
    });
  };

  return (
    <>
      <div className='max-w-md mx-auto space-y-4'>
        <h1 className='h2-bold mt-4'>Shipping Address</h1>
        <p className='text-sm text-muted-foreground'>Please enter an address to ship your order</p>

        <div>
          <Form {...form}>
            <form
              method='post'
              className='space-y-4'
              onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col md:flex-row gap-4'>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'fullName'> }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Mark Smith'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex flex-col md:flex-row gap-4'>
                <FormField
                  control={form.control}
                  name='streetAddress'
                  render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'streetAddress'> }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter address'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex flex-col md:flex-row gap-4'>
                <FormField
                  control={form.control}
                  name='country'
                  render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'country'> }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter country name'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex flex-col md:flex-row gap-4'>
                <FormField
                  control={form.control}
                  name='city'
                  render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'city'> }) => (
                    <FormItem className='w-full'>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter city'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex flex-col md:flex-row gap-4'>
                <FormField
                  control={form.control}
                  name='postalCode'
                  render={({ field }: { field: ControllerRenderProps<z.infer<typeof shippingAddressSchema>, 'postalCode'> }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Enter Postal Code'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex gap-2'>
                <Button
                  type='submit'
                  disabled={isPending}>
                  Continue
                  {isPending ? <LoaderIcon className='w-4 h-4 animate-spin' /> : <ArrowRightIcon className='w-4 h-4' />}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};
