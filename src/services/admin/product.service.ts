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

const getAdminProductById = async (id) => {
  return await prisma.product.findFirst({
    where: {
      id: +id
    }
  })
}

const updateProductById = async (
  id: string,
  name: string,
  price: number,
  detailDesc: string,
  shortDesc: string,
  quantity: number,
  factory: string,
  target: string,
  image: string,
) => {
  const updatedUser = await prisma.product.update({
    where: {
      id: +id
    },
    data: {
        name: name,
        price: +price,
        detailDesc: detailDesc,
        shortDesc: shortDesc,
        quantity: +quantity,
        factory: factory,
        target: target,
        ...(image !== undefined && {image: image})
    }
  });
}

const deleteProductById = async (id: string) => {
  return await prisma.product.delete({
    where: {
      id: +id,
    }
  });
}

export { handleCreateProduct, getProductList, getAdminProductById, updateProductById, deleteProductById }