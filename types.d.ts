type UserOrderStatus = "pending" | "completed" | "cancelled" | "denied";
type PaymentMethod = "gcash" | "paypal" | "cash";
type UserRole = "admin" | "user";
interface UserOrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: string;
  size: string;
  created: number;
}
interface UserOrders {
  id: string;
  status: UserOrderStatus;
  items: UserOrderItem[];
  payment_method: PaymentMethod;
  image?: string;
  total_payment: string;
  created: number;
}
export interface UserModel {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean | null;
  address: string;
  phone_number: string;
  orders: UserOrders[];
  paypal_email?: string;
  role: UserRole;
  created: number;
}
