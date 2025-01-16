import { z } from 'zod';
import { formatPrice } from './utils';

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
