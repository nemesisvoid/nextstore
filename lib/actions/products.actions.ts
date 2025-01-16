'use server';

import { prisma } from '@/db/prisma';
import { convertToJson } from '../utils';

export const getLatestProducts = async () => {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return convertToJson(data);
};

export const getProductBySlug = async (slug: string) => {
  return await prisma.product.findFirst({ where: { slug } });
};
