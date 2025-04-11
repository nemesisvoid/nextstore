import { z } from 'zod';
import { formatPrice } from './utils';
import { PAYMENT_METHODS } from './constants';

// schema for inserting items

const currency = z.string().refine(value => /^\d+(\.\d{2})?$/.test(formatPrice(Number(value))), 'price must have 2 decimal places');

export const insertProductSchema = z.object({
  name: z.string().min(3, 'name must be at least 3 characters'),
  slug: z.string().min(3, 'slug must be at least 3 characters'),
  category: z.string().min(3, 'category must be at least 3 characters'),
  description: z.string(),
  price: currency,
  brand: z.string().min(3, 'brand must be at least 3 characters'),
  image: z.string(),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'product must have at least one image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
});

export const signInSchema = z.object({
  email: z.string().email('invalid email address'),
  password: z.string().min(6, 'password must be at least 6 characters'),
});

export const signUpSchema = z
  .object({
    name: z.string().min(3, 'name must be at least 3 characters'),
    email: z.string().email('invalid email address'),
    password: z.string().min(6, 'password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'confirm password must be at least 6 characters'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'passwords do not match',
    path: ['confirmPassword'],
  });

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'product is required'),
  name: z.string().min(1, 'name is required'),
  slug: z.string().min(1, 'slug is required'),
  qty: z.number().int().nonnegative('quantity must be a positive number'),
  image: z.string().min(1, 'image is required'),
  price: currency,
});

export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'session Cart id is required'),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'name must be at least 3 characters'),
  streetAddress: z.string().min(5, 'street address must be at least 5 characters'),
  city: z.string().min(3, 'city must be at least 3 characters'),
  country: z.string().min(4, 'country must be at least 4 characters'),
  postalCode: z.string().min(5, 'postal code must be at least 5 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'payment method is required'),
  })
  .refine(data => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'invalid payment method',
  });

export const OrderSchema = z.object({
  userId: z.string().min(1, 'user id is required'),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine(data => PAYMENT_METHODS.includes(data), {
    path: ['paymentMethod'],
    message: 'invalid payment method',
  }),
  shippingAddress: shippingAddressSchema,
});

export const OrderItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  slug: z.string(),
  image: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  pricePaid: z.string(),
  email_address: z.string(),
});
