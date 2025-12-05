import * as z from "zod"; 

export const ProductSchema = z.object({ 
  name:   z.string().trim().min(1, "Tên phải chứa ít nhất 1 ký tự"),
  price:  z.number().min(1, "Giá phải >= 1"),
  image:      z.string().trim().min(1),
  detailDesc: z.string().trim().min(1, "Mô tả phải có ít nhất 1 ký tự"),
  shortDesc:  z.string().trim().min(1, "Mô tả phải có ít nhất 1 ký tự"),
  quantity:   z.number().min(1, "Số lượng phải >= 1"),
  sold:       z.string().trim().min(1, "Mô tả phải có ít nhất 1 ký tự"),
  factory:    z.string().trim().min(1, "Mô tả phải có ít nhất 1 ký tự"),
  target:     z.string().trim().min(1, "Mô tả phải có ít nhất 1 ký tự"),
});

export type TProductSchema = z.infer<typeof ProductSchema>;