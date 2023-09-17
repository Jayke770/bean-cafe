import { z } from "zod";
//user
const UserStatus = z.union([z.literal("new"), z.literal("old")]);
export type UserStatus = z.infer<typeof UserStatus>
const UserRole = z.union([z.literal("admin"), z.literal("user")]);
const OrderStatusData = z.union([
  z.literal("pending"),
  z.literal("completed"),
  z.literal("cancelled"),
  z.literal("denied"),
]);
export type OrderStatus = z.infer<typeof OrderStatus>
const UserOrderItem = z.object({
  id: z.string(),
  product_id: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: z.string(),
  item_name: z.string(),
  price: z.number(),
  created: z.number(),
});
const PaymentMethod = z.union([
  z.literal("gcash"),
  z.literal("paypal"),
  z.literal("cash"),
]);
export type paymentMethod = z.infer<typeof PaymentMethod>
const UserOrder = z.object({
  id: z.string(),
  status: OrderStatusData,
  items: z.array(UserOrderItem),
  payment_method: PaymentMethod,
  total_payment: z.string(),
  created: z.number(),
});
const UserCartData = z.object({
  id: z.string(),
  item_id: z.string(),
  quantity: z.number(),
  size: z.string().optional(),
  item_name: z.string(),
  price: z.number(),
  category: z.string(),
  created: z.number()
})
export type UserCart = z.infer<typeof UserCartData>
const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  image: z.string(),
  emailVerified: z.boolean().or(z.null()),
  address: z.string(),
  phone_number: z.string(),
  orders: z.array(UserOrder),
  cart: z.array(UserCart),
  paypal_email: z.string().optional(),
  role: UserRole,
  status: UserStatus,
  created: z.number(),
});
export type UserRole = z.infer<typeof UserRole>;
export type UserModel = z.infer<typeof UserSchema>;
const Categories = z.union([
  z.literal("coffee"),
  z.literal("burger"),
  z.literal("cakes"),
]);
//add ons
const AddOnOption = z.object({
  name: z.string(),
  addon_option_id: z.string(),
  price: z.number(),
  stocks: z.number(),
  created: z.number(),
});
const AddOnSchema = z.object({
  name: z.string(),
  image: z.string(),
  price: z.number(),
  stocks: z.number(),
  category: Categories,
  created: z.number().optional(),
  id: z.string()
});
export type AddOns = z.infer<typeof AddOnSchema>;
//items
export const CoffeesizeSchema = z.union([
  z.literal("small"),
  z.literal("medium"),
  z.literal("large"),
  z.literal("extra large"),
]).or(z.optional());
const ItemSizes = z.object({
  id: z.string(),
  stocks: z.number(),
  price: z.number(),
  type: CoffeesizeSchema,
});
const ItemsChema = z.object({
  item_id: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  price: z.number().optional(),
  stocks: z.number().optional(),
  sizes: z.array(ItemSizes),
  addons: z.array(AddOnOption),
  created: z.number(),
});
export type Items = z.infer<typeof ItemsChema>;
export type ApiResponse = {
  status?: boolean;
  message?: string;
};
