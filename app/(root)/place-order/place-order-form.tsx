'use client';

import { Button } from '@/components/ui/button';
import { createOrder } from '@/lib/actions/order.actions';
import { Check, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useTransition } from 'react';

const PlaceOrderForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createOrder();
      if (res.redirectTo) router.push(res.redirectTo);
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <Button className='flex items-center w-full'> Place Order{isPending ? <Loader className='w-4 h-4' /> : <Check className='w-4 h-4' />}</Button>
    </form>
  );
};

export default PlaceOrderForm;
