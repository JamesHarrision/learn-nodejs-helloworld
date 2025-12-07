import * as z from "zod";

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Tên phải chứa ít nhất 1 ký tự"),
  price: z.string()
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((num) => num > 0, {
      message: "Số tiền tối thiểu là 1",
    }),
  detailDesc: z.string().trim().min(1, "Mô tả phải có ít nhất 1 ký tự"),
  shortDesc: z.string().trim().min(1, "Mô tả phải có ít nhất 1 ký tự"),
  quantity: z.string()
    .transform((val) => (val === "" ? 0 : Number(val)))
    .refine((num) => num > 0, {
      message: "Số lượng tối thiểu là 1",
    }),
  factory: z.string().trim().min(1, "NSX không được rỗng"),
  target: z.string().trim().min(1, "TAG không được rỗng"),
});

export type TProductSchema = z.infer<typeof ProductSchema>;