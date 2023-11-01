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
  orders: z.array(OrdersSchema),
  cart: z.array(UserCartData),
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
  _id: z.any(),
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
  _id: z.any(),
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
  isBestSeller: z.boolean()
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
  userID: z.any(),
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
type PaypalMode = "sandbox" | "live"
interface PaypalConfig {
  client_id: string,
  client_secret: string,
  mode: PaypalMode
}
interface Credentials {
  scope: string
  access_token: string
  token_type: string
  app_id: string
  expires_in: number
  nonce: string
}
interface CreateOrder {
  intent: string
  purchase_units: {
    items?: {
      name: string,
      quantity: string,
      description?: string,
      sku?: string,
      category?: "DIGITAL_GOODS" | "PHYSICAL_GOODS" | "DONATION",
      unit_amount?: {
        currency_code: string,
        value: string
      },
    }[],
    amount: {
      currency_code: string
      value: string,
      breakdown: {
        item_total: {
          currency_code: string,
          value: string
        },
        shipping?: {
          currency_code: string,
          value: string
        }
      }
    }
  }[],
  payment_source: {
    paypal: {
      experience_context: {
        brand_name: string
        cancel_url: string
        return_url: string
        payment_method_selected: string
        user_action: string
      }
    }
  }
}
interface CreateOrderResponse {
  id: string
  status: "PAYER_ACTION_REQUIRED",
  payment_source: {
    paypal: {}
  }
  links: {
    href: string
    rel: "payer-action" | "self"
    method: "GET" | "POST"
  }[]
}
interface PaymentDetails {
  id: string
  intent: string
  status: 'COMPLETED' | 'APPROVED',
  payment_source: {
    paypal: {
      email_address: string
      account_id: string
      account_status: string
      name: {
        given_name: string
        surname: string
      }
      address: {
        country_code: string
      }
    }
  }
  purchase_units: {
    reference_id: string
    amount: {
      currency_code: string
      value: string
      breakdown: {
        item_total: {
          currency_code: string
          value: string
        }
      }
    }
    payee: {
      email_address: string
      merchant_id: string
      display_data: {
        brand_name: string
      }
    }
    soft_descriptor: string
    items: Array<{
      name: string
      unit_amount: {
        currency_code: string
        value: string
      }
      quantity: string
      description: string
    }>
    shipping: {
      name: {
        full_name: string
      }
      address: {
        address_line_1: string
        admin_area_2: string
        admin_area_1: string
        postal_code: string
        country_code: string
      }
    }
    payments: {
      captures: Array<{
        id: string
        status: string
        amount: {
          currency_code: string
          value: string
        }
        final_capture: boolean
        disbursement_mode: string
        seller_protection: {
          status: string
          dispute_categories: Array<string>
        }
        seller_receivable_breakdown: {
          gross_amount: {
            currency_code: string
            value: string
          }
          paypal_fee: {
            currency_code: string
            value: string
          }
          net_amount: {
            currency_code: string
            value: string
          }
          receivable_amount: {
            currency_code: string
            value: string
          }
          exchange_rate: {
            source_currency: string
            target_currency: string
            value: string
          }
        }
        links: Array<{
          href: string
          rel: string
          method: string
        }>
        create_time: string
        update_time: string
      }>
    }
  }[],
  payer: {
    name: {
      given_name: string
      surname: string
    }
    email_address: string
    payer_id: string
    address: {
      country_code: string
    }
  }
  create_time: string
  update_time: string
  links: {
    href: string
    rel: "self" | "refund" | "up" | "payer-action"
    method: "GET" | "POST"
  }[]
}
interface CapturePayment {
  id: string
  status: string
  payment_source: {
    paypal: {
      email_address: string
      account_id: string
      account_status: string
      name: {
        given_name: string
        surname: string
      }
      address: {
        country_code: string
      }
    }
  }
  purchase_units: {
    reference_id: string
    shipping: {
      name: {
        full_name: string
      }
      address: {
        address_line_1: string
        admin_area_2: string
        admin_area_1: string
        postal_code: string
        country_code: string
      }
    }
    payments: {
      captures: Array<{
        id: string
        status: string
        amount: {
          currency_code: string
          value: string
        }
        final_capture: boolean
        disbursement_mode: string
        seller_protection: {
          status: string
          dispute_categories: string[]
        }
        seller_receivable_breakdown: {
          gross_amount: {
            currency_code: string
            value: string
          }
          paypal_fee: {
            currency_code: string
            value: string
          }
          net_amount: {
            currency_code: string
            value: string
          }
          receivable_amount: {
            currency_code: string
            value: string
          }
          exchange_rate: {
            source_currency: string
            target_currency: string
            value: string
          }
        }
        links: {
          href: string
          rel: "self" | "up" | "refund"
          method: "GET" | "POST"
        }[],
        create_time: string
        update_time: string
      }>
    }
  }[],
  payer: {
    name: {
      given_name: string
      surname: string
    }
    email_address: string
    payer_id: string
    address: {
      country_code: string
    }
  }
  links: {
    href: string
    rel: "self" | "up" | "refund"
    method: "GET" | "POST"
  }
}
interface Refund {
  id: string,
  status: 'COMPLETED',
  links: {
    href: string,
    rel: 'self' | "up",
    method: 'GET'
  }[]
}