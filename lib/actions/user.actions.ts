'use server';

import { paymentMethodSchema, shippingAddressSchema, signInSchema, signUpSchema } from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { hashSync } from 'bcrypt-ts-edge';
import { prisma } from '@/db/prisma';
import { formatError } from '../utils';
import { redirect } from 'next/navigation';
import { shippingAddressType } from '@/types';
import { z } from 'zod';

export const signInUser = async (prevState: unknown, formData: FormData) => {
  try {
    const user = signInSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    await signIn('credentials', user);
    return { success: true, message: 'signed in successfully' };
  } catch (error) {
    console.log(error);
    if (isRedirectError(error)) throw error;
    console.error(error);
    return { error: true, message: 'invalid email or password' };
  }
};

export const signOutUser = async () => {
  try {
    await signOut();
    redirect('/');
  } catch (error) {
    console.error(error);
  }
};

export const signUpUser = async (prevState: unknown, formData: FormData) => {
  try {
    const user = signUpSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({ data: { name: user.name, email: user.email, password: user.password } });

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });
    return { success: true, message: 'signed up successfully' };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: true, message: formatError(error) };
  }
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findFirst({ where: { id: userId } });
  if (!user) throw new Error('user not found');

  return user;
};

export const updateUserAddress = async (data: shippingAddressType) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error('user not found');

    const currentUser = await prisma.user.findFirst({ where: { id: userId } });

    if (!currentUser) throw new Error('user not found');

    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: userId },
      data: { address },
    });
    return { success: true, message: 'address updated successfully' };
  } catch (error) {
    console.error(error);
    return { success: false, message: formatError(error) };
  }
};

export const updateUserPaymentMethod = async (data: z.infer<typeof paymentMethodSchema>) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error('user not found');

    const currentUser = await prisma.user.findFirst({ where: { id: userId } });
    if (!currentUser) throw new Error('user not found');

    console.log('payment', data);
    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });

    return {
      success: true,
      message: 'payment method updated successfully',
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: formatError(error) };
  }
};
