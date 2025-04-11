'use server';

import { cartItemType } from '@/types';
import { convertToJson, formatError, round2 } from '../utils';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, cartSchema } from '../validators';
import { console } from 'inspector';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

// calculate cart price

const calcPrice = (items: cartItemType[]) => {
  const itemsPrice = round2(items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(itemsPrice * 0.15),
    totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
  };
};

export const AddItemToCart = async (data: cartItemType) => {
  console.log('AddItemToCart called with data:', data);
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('session cart not found');

    console.log('Session cart ID:', sessionCartId);

    // get userid and session
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    console.log('User ID:', userId);

    // get cart
    const cart = await getCart();

    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    console.log('Product found:', product);

    if (!product) throw new Error('Product not found');

    if (!cart) {
      const newCart = cartSchema.parse({
        userId: userId,
        sessionCartId,
        items: [item],
        ...calcPrice([item]),
      });

      await prisma.cart.create({ data: newCart });
      console.log(newCart);

      revalidatePath(`/product/${product.slug}`);
      return { success: true, message: 'Item added to cart' };
    } else {
      const existingItem = (cart.items as cartItemType[]).find(x => x.productId === item.productId);

      if (existingItem) {
        // check stock
        if (product.stock < existingItem.qty + 1) return { success: false, message: 'Not enough stock' };

        // increase item quantity
        (cart.items as cartItemType[]).find(x => x.productId === item.productId)!.qty = existingItem.qty + 1;
      } else {
        if (product.stock < 1) throw new Error('Not enough stock');

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: {
          id: cart.id,
        },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as cartItemType[]),
        },
      });
      revalidatePath(`/products/${product.slug}`);
      return { success: true, message: `${product.name} ${existingItem ? 'updated in' : 'added to'} cart` };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: formatError(error) };
  }
};

// export const getCart = async () => {
//   const sessionCartId = (await cookies()).get('sessionCartId')?.value;
//   if (!sessionCartId) throw new Error('session cart not found');
//   console.log('Session cart:', sessionCartId);

//   // get userid and session
//   const session = await auth();
//   const userId = session?.user?.id ? (session.user.id as string) : undefined;

//   // get user cart
//   const cart = await prisma.cart.findFirst({
//     where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
//   });

//   if (!cart) return undefined;

//   // convert decimals and return
//   return convertToJson({
//     ...cart,
//     items: cart.items as cartItemType[],
//     itemsPrice: cart.itemsPrice.toString(),
//     totalPrice: cart.totalPrice.toString(),
//     shippingPrice: cart.shippingPrice.toString(),
//     taxPrice: cart.taxPrice.toString(),
//   });
// };

export const getCart = async () => {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) {
    console.error('Session cart not found');
    throw new Error('session cart not found');
  }
  console.log('Session cart ID:', sessionCartId);

  // Get user ID and session
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  console.log('User ID:', userId);

  // Get user cart
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) {
    console.error('Cart not found');
    return undefined;
  }

  console.log('Cart found:', cart);

  // Convert decimals and return
  return convertToJson({
    ...cart,
    items: cart.items as cartItemType[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
};

export const removeItemFromCart = async (productId: string) => {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('session cart not found');

    // get product
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!product) throw new Error('Product not found');

    // get user's cart
    const cart = await getCart();
    if (!cart) throw new Error('Cart not found');

    // check for item
    const existingItem = (cart.items as cartItemType[]).find(x => x.productId === productId);

    if (!existingItem) throw new Error('Item not found');

    // check if only one in quantity
    if (existingItem?.qty === 1) {
      // remove from cart
      cart.items = (cart.items as cartItemType[]).filter(x => x.productId !== existingItem.productId);
    } else {
      (cart.items as cartItemType[]).find(x => x.productId === productId)!.qty = existingItem.qty - 1;
    }

    // update cart in database
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as cartItemType[]),
      },
    });

    revalidatePath(`/product/${product.slug}`);
    return { success: true, message: `${product.name} removed from cart` };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
