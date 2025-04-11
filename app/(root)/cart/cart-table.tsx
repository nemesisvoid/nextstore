'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { useToast } from '@/hooks/use-toast';

import { AddItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';

import { cartSchemaType } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon, LoaderIcon, MinusIcon, PlusIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export const CartTable = ({ cart }: { cart?: cartSchemaType }) => {
  const router = useRouter();

  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  return (
    <>
      <h1 className='text-3xl mt-4 mb-10'>Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is empty <Link href={'/'}>Go Shopping</Link>
        </div>
      ) : (
        <div className='grid md:grid-cols-4 md:gap-5'>
          <div className='overflow-x-auto md:col-span-3'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.items.map(item => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Link
                        className='flex items-center'
                        href={`/product/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={50}
                          height={50}
                        />

                        <span className='px-2'>{item.name}</span>
                      </Link>
                    </TableCell>

                    <TableCell className='flex gap-2'>
                      <div className=' flex items-center gap-3'>
                        <Button
                          variant='outline'
                          onClick={() =>
                            startTransition(async () => {
                              const res = await removeItemFromCart(item.productId);

                              if (!res.success) {
                                toast({
                                  variant: 'destructive',
                                  description: res.message,
                                });
                              }
                            })
                          }
                          disabled={isPending}>
                          {isPending ? <LoaderIcon className='w-4 h-4 animate-spin' /> : <MinusIcon />}
                        </Button>
                        <span>{item.qty}</span>

                        <Button
                          variant='outline'
                          onClick={() =>
                            startTransition(async () => {
                              const res = await AddItemToCart(item);
                              if (!res.success) {
                                toast({
                                  variant: 'destructive',
                                  description: res.message,
                                });
                              }
                            })
                          }
                          disabled={isPending}>
                          {isPending ? <LoaderIcon className='w-4 h-4 animate-spin' /> : <PlusIcon />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className='text-right'>${+item.price * item.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Card>
            <CardContent className='p-4 gap-4'>
              <div className='text-xl pb-3'>
                Subtotal({cart.items.reduce((acc, item) => acc + item.qty, 0)}): <span className='font-bold'>{formatCurrency(cart.itemsPrice)}</span>
              </div>

              <Button
                className='mt-24'
                disabled={isPending}
                onClick={() => startTransition(() => router.push('/shipping-address'))}>
                {isPending ? <LoaderIcon className='w-4 h-4 animate-spin' /> : <ArrowRightIcon className='w-4 h-4' />} Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};
