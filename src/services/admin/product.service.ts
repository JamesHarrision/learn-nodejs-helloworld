import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

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
      ...(imageUpload && { image: imageUpload })
    }
  });
  return product;
}

const getProductList = async (page: number) => {

  const pageSize = TOTAL_ITEMS_PER_PAGE;
  const skip = (page - 1) * pageSize;

  return await prisma.product.findMany({
    skip: skip,
    take: pageSize
  });
}

const countTotalProductPage = async () => {
  const pageSize = TOTAL_ITEMS_PER_PAGE;
  const totalItems = await prisma.product.count();
  const totalPages = Math.ceil(totalItems / pageSize);
  return totalPages;
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
      ...(image !== undefined && { image: image })
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

export { handleCreateProduct, getProductList, getAdminProductById, updateProductById, deleteProductById, countTotalProductPage }