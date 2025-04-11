'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { z } from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

import { DEFAULT_PAYMENT_METHOD, PAYMENT_METHODS } from '@/lib/constants';
import { paymentMethodSchema } from '@/lib/validators';

import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { LoaderIcon, ArrowRightIcon } from 'lucide-react';
import { RadioGroupItem, RadioGroup } from '@/components/ui/radio-group';
import { updateUserPaymentMethod } from '@/lib/actions/user.actions';

export const PaymentMethodForm = ({ preferredPaymentMethod }: { preferredPaymentMethod: string | null }) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof paymentMethodSchema>>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      type: preferredPaymentMethod || DEFAULT_PAYMENT_METHOD,
    },
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = async (values: z.infer<typeof paymentMethodSchema>) => {
    console.log('values', values);
    startTransition(async () => {
      const res = await updateUserPaymentMethod(values);
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });

        return;
      }

      router.push('/place-order');
    });
  };

  return (
    <>
      <div className='max-w-md mx-auto space-y-4'>
        <h1 className='h2-bold mt-4'>Payment Method</h1>
        <p className='text-sm text-muted-foreground'>Please select a payment method</p>

        <div>
          <Form {...form}>
            <form
              method='post'
              className='space-y-4'
              onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col md:flex-row gap-4'>
                <FormField
                  control={form.control}
                  name='type'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className='space-y-2'>
                          {PAYMENT_METHODS.map(payment => (
                            <FormItem
                              key={payment}
                              className='flex items-center space-x-3'>
                              <FormControl>
                                <RadioGroupItem
                                  value={payment}
                                  checked={field.value === payment}
                                />
                              </FormControl>
                              <FormLabel className='font-normal'>{payment}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
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
