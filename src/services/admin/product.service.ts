import { prisma } from "config/client";

const handleCreateProduct = async (
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,  
  target: string,
  imageUpload: string,
) => {
  const product = await prisma.product.create({
    data: {
      name: name,
      price: +price,
      detailDesc: detailDesc,
      shortDesc: shortDesc,
      quantity: +quantity,
      factory: factory,
      target: target,
      ...(imageUpload && {image: imageUpload})
    }
  });
  return product;
}

const getProductList = async () => {
  return await prisma.product.findMany();
}

const getProductById = async (id) => {
  return await prisma.product.findFirst({
    where: {
      id: +id
    }
  })
}

export { handleCreateProduct, getProductList, getProductById }