import { redirect } from 'next/navigation';
import { Metadata } from 'next';

import { auth } from '@/auth';
import { getCart } from '@/lib/actions/cart.actions';
import { getUserById } from '@/lib/actions/user.actions';

import { ShippingAddressForm } from './shipping-address-form';
import { shippingAddressType } from '@/types';
import { CheckOutSteps } from '@/components/shared/product/checkout-steps';

export const metadata: Metadata = {
  title: 'Shipping Address',
};
const ShippingAddressPage = async () => {
  const cart = await getCart();
  if (!cart || cart.items?.length === 0) redirect('/cart');
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('user not found');

  const user = await getUserById(userId);

  return (
    <>
      <CheckOutSteps current={1} />
      <ShippingAddressForm address={user.address as shippingAddressType} />
    </>
  );
};

export default ShippingAddressPage;
