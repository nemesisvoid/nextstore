import { z } from 'zod';
import {
  insertProductSchema,
  cartSchema,
  cartItemSchema,
  shippingAddressSchema,
  OrderSchema,
  OrderItemSchema,
  paymentResultSchema,
} from '@/lib/validators';

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
  // numReviews: number;
};

export type cartSchemaType = z.infer<typeof cartSchema>;
export type cartItemType = z.infer<typeof cartItemSchema>;

export type shippingAddressType = z.infer<typeof shippingAddressSchema>;

export type OrderItemType = z.infer<typeof OrderItemSchema>;
export type OrderType = z.infer<typeof OrderSchema> & {
  id: string;
  isPaid: boolean;
  createdAt: Date;
  paidAt: Date | null;
  isDelivered: boolean;
  deliveredAt: Date | null;
  orderitems: OrderItemType[];
  user: { name: string; email: string };
};

export type PaymentResultType = z.infer<typeof paymentResultSchema>;
