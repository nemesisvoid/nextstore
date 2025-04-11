'use client';

import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/hooks/use-toast';
import { AddItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { cartItemType, cartSchemaType } from '@/types';
import { Plus, Minus, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const AddToCart = ({ item, cart }: { cart?: cartSchemaType; item: cartItemType }) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await AddItemToCart(item);
      if (!res.success)
        toast({
          variant: 'destructive',
          description: res.message,
        });

      toast({
        variant: 'default',
        description: `${res.message}`,
        action: (
          <ToastAction
            className='bh-primary text-white hover:bg-gray-800'
            altText='Go to cart'
            onClick={() => router.push('/cart')}>
            Go to cart
          </ToastAction>
        ),
      });
    });
  };
  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
      });

      return;
    });
  };

  // check if item

  const isInCart = cart && cart.items.find(x => x.productId === item.productId);

  return isInCart ? (
    <div className=' flex items-center mt-5'>
      {isPending ? (
        <Loader className='animate-spin' />
      ) : (
        <>
          <Button
            type='button'
            variant='outline'
            onClick={handleRemoveFromCart}>
            <Minus className='h-2 w-2' />
          </Button>
          <span className='px-2'>{isInCart.qty}</span>

          <Button
            type='button'
            variant='outline'
            onClick={handleAddToCart}>
            <Plus
              className='h-2 w-2'
              size={2}
            />
          </Button>
        </>
      )}
    </div>
  ) : (
    <Button
      className='w-full mt-5 '
      type='button'
      onClick={handleAddToCart}>
      {isPending ? (
        <Loader className='animate-spin' />
      ) : (
        <span className='flex items-center gap-1'>
          <Plus />
          Add To Cart
        </span>
      )}
    </Button>
  );
};

export default AddToCart;
