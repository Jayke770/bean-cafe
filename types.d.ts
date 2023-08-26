import { z } from "zod";
//user
const UserStatus = z.union([z.literal("new"), z.literal("old")]);
const UserRole = z.union([z.literal("admin"), z.literal("user")]);
const OrderStatus = z.union([
  z.literal("pending"),
  z.literal("comleted"),
  z.literal("cancelled"),
  z.literal("denied"),
]);
const UserOrderItem = z.object({
  id: z.string(),
  product_id: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: z.string(),
  created: z.number(),
});
const PaymentMethod = z.union([
  z.literal("gcash"),
  z.literal("paypal"),
  z.literal("cash"),
]);
const UserOrder = z.object({
  id: z.string(),
  status: OrderStatus,
  items: z.array(UserOrderItem),
  payment_method: PaymentMethod,
  total_payment: z.string(),
  created: z.number(),
});
const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  image: z.string(),
  emailVerified: z.boolean().or(z.null()),
  address: z.string(),
  phone_number: z.string(),
  orders: z.array(UserOrder),
  paypal_email: z.string().optional(),
  role: UserRole,
  status: UserStatus,
  created: z.number(),
});
export type UserRole = z.infer<typeof UserRole>;
export type UserModel = z.infer<typeof UserSchema>;
//add ons
const AddOnCategory = z.union([z.literal("coffee"), z.literal("burger")]);
const AddOnOption = z.object({
  name: z.string(),
  id: z.string(),
  created: z.number(),
  price: z.number(),
});
const AddOnSchema = z.object({
  name: z.string(),
  image_id: z.string(),
  category: AddOnCategory,
  options: z.array(AddOnOption),
  created: z.number().optional(),
});
export type AddOns = z.infer<typeof AddOnSchema>;
//items
const CoffeesizeSchema = z.union([
  z.literal("small"),
  z.literal("medium"),
  z.literal("large"),
]);
const ItemSizes = z.object({
  id: z.string(),
  stocks: z.number(),
  size: CoffeesizeSchema,
});
const ItemsChema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  sizes: z.array(ItemSizes),
  addons: z.array(AddOnOption),
  created: z.number(),
});
export type Items = z.infer<typeof ItemsChema>;
export type ApiResponse = {
  status: boolean;
  message: string;
};
