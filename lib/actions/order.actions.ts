'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { convertToJson, formatError } from '../utils';
import { auth } from '@/auth';
import { getCart } from './cart.actions';
import { getUserById } from './user.actions';
import { OrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { cartItemType, PaymentResultType } from '@/types';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';

export const createOrder = async () => {
  try {
    const session = await auth();
    const cart = await getCart();
    const userId = session?.user?.id;
    if (!session) throw new Error('user not authenticated');
    if (!userId) throw new Error('User not found');

    const user = await getUserById(userId);

    if (!cart || cart.items?.length === 0)
      return {
        success: false,
        message: 'Cart is empty',
        redirectTo: '/cart',
      };

    if (!user.address)
      return {
        success: false,
        message: 'Please add shipping address before checkout',
        redirectTo: '/shipping-address',
      };

    if (!user.paymentMethod)
      return {
        success: false,
        message: 'Please add shipping address before checkout',
        redirectTo: '/payment-method',
      };

    if (!user.paymentMethod)
      return {
        success: false,
        message: 'Please add shipping address before checkout',
        redirect: '/shipping-address',
      };

    const order = OrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

    const insertOrderId = await prisma.$transaction(async tx => {
      const insertOrder = await tx.order.create({ data: order });

      for (const items of cart.items as cartItemType[]) {
        await tx.orderItem.create({
          data: { ...items, orderId: insertOrder.id },
        });
      }

      // clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: { items: [], itemsPrice: 0, shippingPrice: 0, taxPrice: 0, totalPrice: 0 },
      });

      return insertOrder.id;
    });

    if (!insertOrderId) throw new Error('order not created');

    return { success: true, message: 'order created successfully', redirectTo: `/order/${insertOrderId}` };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { success: false, message: formatError(error) };
  }
};

export const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: { orderitems: true, user: { select: { name: true, email: true } } },
  });
  if (!order) throw new Error('order not found');

  return convertToJson(order);
};

export const createPayPalOrder = async (orderId: string) => {
  try {
    // find order in database
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (order) {
      // create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: 0,
          },
        },
      });

      return { success: true, message: 'Paypal order created successfully', data: paypalOrder.id };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

// approve paypal order
export const approvePayPalOrder = async (orderId: string, data: { orderID: string }) => {
  try {
    // find order in database
    const order = await prisma.order.findFirst({
      where: { id: orderId },
    });

    if (!order) throw new Error('Order not found');

    const capturePayment = await paypal.capturePayment(data.orderID);

    if (!capturePayment || capturePayment.id !== (order.paymentResult as PaymentResultType).id || capturePayment.status !== 'COMPLETED')
      throw new Error('Payment not approved');

    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: capturePayment.id,
        status: capturePayment.status,
        email_address: capturePayment.payer.email_address,
        pricePaid: capturePayment.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: 'Payment approved successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};

const updateOrderToPaid = async ({ orderId, paymentResult }: { orderId: string; paymentResult?: PaymentResultType }) => {
  // find order in database
  const order = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
    },
  });
  if (!order) throw new Error('Order not found');

  if (order.isPaid) throw new Error('Order already paid');

  // transaction to update order and product stock

  await prisma.$transaction(async tx => {
    // iterate over order items and update product stock
    for (const item of order.orderitems) {
      tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: -item.qty },
        },
      });
    }

    // update order

    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });

  // update order transaction

  const updatedOrder = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found');
};
