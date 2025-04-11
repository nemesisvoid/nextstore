import { auth } from '@/auth';
import { CheckOutSteps } from '@/components/shared/product/checkout-steps';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';
import { formatCurrency } from '@/lib/utils';
import { shippingAddressType } from '@/types';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import PlaceOrderForm from './place-order-form';

export const metadata: Metadata = {
  title: 'Place Order',
};
const PlaceOrderPage = async () => {
  const cart = await getCart();
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('user not found');

  const user = await getUserById(userId);
  if (!cart || cart.items.length === 0) redirect('/cart');
  if (!user.address) redirect('/shipping-address');
  if (!user.paymentMethod) redirect('/payment-method');

  const userAddress = user.address as shippingAddressType;
  return (
    <>
      <CheckOutSteps current={3} />
      <h1 className='py-4 text-2xl'>Place Order</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 md:gap-5'>
        <div className='md:col-span-2 overflow-x-auto space-y-4'>
          <Card className='p-4 gap-4'>
            <CardContent>
              <div className='space-y-3'>
                <h2 className='text-xl pb-4'>Shipping Address</h2>
                <p>{userAddress.fullName}</p>
                <p>
                  {userAddress.streetAddress}, {userAddress.city}, {userAddress.country}, {userAddress.postalCode}
                </p>

                <div>
                  <Link href='/shipping-address'>
                    <Button variant='outline'>Edit</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='p-4 gap-4'>
            <CardContent>
              <div className='space-y-3'>
                <h2 className='text-xl pb-4'>Payment Method</h2>
                <p className='mb-10'>{user.paymentMethod}</p>
                <div>
                  <Link href='/payment-method'>
                    <Button variant='outline'>Edit</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='p-4 gap-4'>
            <CardContent>
              <h2 className='text-xl pb-4'>Order Items</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.items.map(item => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className='flex items-center gap-3'>
                          <Image
                            src={item.image}
                            alt={item.name + ' image'}
                            width={50}
                            height={50}
                          />
                          <p>{item.name}</p>
                        </Link>
                      </TableCell>
                      <TableCell className='px-2'>
                        <span className='text-center'>{item.qty}</span>
                      </TableCell>

                      <TableCell className='px-2'>
                        <span className='text-right'>{item.price}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className='p-4 gap-4 space-y-4'>
              <div className='flex justify-between'>
                <p>Items</p>
                <p>{formatCurrency(cart.itemsPrice)}</p>
              </div>

              <div className='flex justify-between'>
                <p>Tax</p>
                <p>{formatCurrency(cart.shippingPrice)}</p>
              </div>

              <div className='flex justify-between'>
                <p>Shipping</p>
                <p>{formatCurrency(cart.taxPrice)}</p>
              </div>

              <div className='flex justify-between'>
                <p>Total</p>
                <p>{formatCurrency(cart.totalPrice)}</p>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
