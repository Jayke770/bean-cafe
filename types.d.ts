import { z } from "zod";
import { ObjectId } from "mongoose";
//user
const UserStatus = z.union([z.literal("new"), z.literal("old")]);
export type UserStatus = z.infer<typeof UserStatus>
const UserRole = z.union([z.literal("admin"), z.literal("user"), z.literal("staff")]);
const OrderStatusData = z.union([
  z.literal("pending"),
  z.literal("completed"),
  z.literal("cancelled"),
  z.literal("processing"),
  z.literal("denied"),
  z.literal("out for delivery")
]);
export type OrderStatus = z.infer<typeof OrderStatusData>
const UserOrderItem = z.object({
  id: z.string(),
  item_id: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: z.string().optional().or(z.null()),
  item_name: z.string(),
  price: z.number(),
  created: z.number(),
});
const PaymentMethod = z.union([
  z.literal("gcash"),
  z.literal("paypal"),
  z.literal("cash_on_delivery"),
]);
export type paymentMethod = z.infer<typeof PaymentMethod>
export const PaymentMethod = PaymentMethod
const UserOrder = z.object({
  id: z.string(),
  status: OrderStatusData,
  items: z.array(UserOrderItem),
  payment_method: PaymentMethod,
  total_payment: z.string(),
  created: z.number(),
});
const CartStatus = z.union([z.literal("ordered"), z.literal("not-ordered")])
const UserCartData = z.object({
  user_id: z.any(),
  cart_id: z.string(),
  item_id: z.string(),
  quantity: z.number(),
  size: z.string().optional().or(z.null()),
  item_name: z.string(),
  price: z.number(),
  category: z.string(),
  created: z.number(),
  status: CartStatus,
  addon: AddOnSchema.optional()
})
export type UserCart = z.infer<typeof UserCartData>
const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
  image: z.string(),
  emailVerified: z.boolean().or(z.null()),
  address: z.string(),
  phone_number: z.string(),
  orders: z.array(z.instanceof(ObjectId)),
  cart: z.array(z.instanceof(ObjectId)),
  paypal_email: z.string().optional(),
  role: UserRole,
  status: UserStatus,
  created: z.number(),
  password: z.string().optional()
});
export type UserRole = z.infer<typeof UserRole>;
export type UserModel = z.infer<typeof UserSchema>;
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
  category: z.string(),
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
  addons: z.array(AddOnSchema),
  sold: z.number(),
  created: z.number(),
});
export type Items = z.infer<typeof ItemsChema>;
export type ApiResponse = {
  status?: boolean;
  message?: string;
  redirect_url?: string
};
//orders 

const DeliveryType = z.union([z.literal("pickup"), z.literal("deliver")])
const OrdersSchema = z.object({
  orderId: z.string(),
  userID: z.string(),
  items: z.array(UserOrderItem),
  payment_method: z.union([
    z.literal("gcash"),
    z.literal("paypal"),
    z.literal("cash_on_delivery"),
  ]),
  status: OrderStatusData,
  message: z.string().optional(),
  gcash_image: z.string().optional(),
  created: z.number(),
  total_payment: z.string(),
  payment_id: z.string().optional(),
  isPaid: z.boolean().optional(),
  name: z.string(),
  address: z.string(),
  isApproved: z.boolean(),
  isRefunded: z.boolean(),
  orderStatus: z.array(z.string()),
  deliveryType: DeliveryType,
  fee: z.string(),
  phone_number: z.string()
})
export type deliverType = z.infer<typeof DeliveryType>
export type Orders = z.infer<typeof OrdersSchema>
export type ReportType = "users" | "orders"
export type ReportData = "daily" | "monthly" | "yearly"

const Categories = z.object({
  type: z.string(),
  created: z.number()
})
export type CategoriesType = z.infer<typeof Categories>