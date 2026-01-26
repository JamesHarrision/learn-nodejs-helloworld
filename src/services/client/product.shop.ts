import { Prisma } from "@prisma/client";
import { prisma } from "config/client";

export const getProductByFilter = async (
  page: number, pageSize: number,
  factory: string,
  target: string,
  price: string,
  sort: string) => {

  const skip = (page - 1) * pageSize || 0;

  let whereClause: Prisma.ProductWhereInput = {};
  if (factory) {
    whereClause.factory = { in: factory.split(',') }
  }
  if (target) {
    whereClause.target = { in: target.split(',') }
  }
  if (price) {
    const priceInput = price.split(',');
    let priceCondition: Prisma.ProductWhereInput[] = [];
    for (const p of priceInput) {
      if (p === 'duoi-10-trieu') priceCondition.push({ price: { lt: 10000000 } });
      else if (p === '10-15-trieu') priceCondition.push({ price: { gte: 10000000, lt: 15000000 } });
      else if (p === '15-20-trieu') priceCondition.push({ price: { gte: 15000000, lt: 20000000 } });
      else if (p === 'tren-20-trieu') priceCondition.push({ price: { gt: 20000000 } });
    }
    if (priceCondition.length > 0) {
      whereClause.OR = priceCondition;
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput | undefined;
  if (sort === 'gia-tang-dan') orderBy = { price: "asc" };
  else if (sort === 'gia-giam-dan') orderBy = { price: "desc" };

  const [products, count] = await prisma.$transaction([
    prisma.product.findMany({
      skip,
      take: pageSize,
      where: whereClause,
      orderBy: orderBy
    }),
    prisma.product.count({ where: whereClause })
  ]);

  return {
    products,
    totalPages: Math.ceil(count / pageSize)
  };
}