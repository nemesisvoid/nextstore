import { getOrderById } from '@/lib/actions/order.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OrderDetailsTable from './order-details-table';
import { shippingAddressType } from '@/types';

export const metadata: Metadata = {
  title: 'Order Details',
};

const OrderPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();
  return (
    <div>
      <OrderDetailsTable
        order={{ ...order, shippingAddress: order.shippingAddress as shippingAddressType }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      />
    </div>
  );
};

export default OrderPage;
