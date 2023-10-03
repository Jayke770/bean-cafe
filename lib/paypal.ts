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
        rel: "self" | "refund" | "up"
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

export default class Paypal {
    private config?: PaypalConfig
    private live_endpoint: string = ""
    private sandbox_endpoint: string = 'https://api-m.sandbox.paypal.com'
    private endpoint: string = this.sandbox_endpoint
    private credentials?: Credentials
    constructor(config: PaypalConfig) {
        this.config = config
        this.endpoint = config?.mode === "live" ? this.live_endpoint : this.sandbox_endpoint
    }
    authenticate() {
        return new Promise<void>(async (resolve, reject) => {
            if (!this.endpoint || !this.config) reject("Paypal not initialize")
            const endpoint = `${this.endpoint}/v1/oauth2/token`
            const credentials = `${this.config?.client_id}:${this.config?.client_secret}`
            const base64_credentials = Buffer.from(credentials).toString("base64");
            await fetch(endpoint, {
                method: 'post',
                headers: {
                    Authorization: `Basic ${base64_credentials}`,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({ grant_type: "client_credentials" })
            })
                .then(e => e.json())
                .then((res: Credentials) => {
                    this.credentials = res
                    resolve()
                })
                .catch(e => reject(e))
        })
    }
    createPayment(data: CreateOrder) {
        return new Promise<CreateOrderResponse>(async (resolve, reject) => {
            if (!this.endpoint || !this.config) reject("Paypal not initialize")
            if (!this.credentials) reject("Invalid Credentials")
            const credentials = this.credentials
            const endpoint = `${this.endpoint}/v2/checkout/orders`
            await fetch(endpoint, {
                method: 'post',
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${credentials?.token_type} ${credentials?.access_token}`
                },
                body: JSON.stringify(data)
            })
                .then(e => e.json())
                .then(res => resolve(res))
                .catch(e => reject(e))
        })
    }
    capturePayment(id: string) {
        return new Promise<CapturePayment>(async (resolve, reject) => {
            if (!this.endpoint || !this.config) reject("Paypal not initialize")
            if (!this.credentials) reject("Invalid Credentials")
            const credentials = this.credentials
            const endpoint = `${this.endpoint}/v2/checkout/orders/${id}/capture`
            await fetch(endpoint, {
                method: 'post',
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${credentials?.token_type} ${credentials?.access_token}`
                }
            })
                .then(e => e.json())
                .then(res => resolve(res))
                .catch(e => reject(e))
        })
    }
    paymentDetails(id: string) {
        return new Promise<PaymentDetails>(async (resolve, reject) => {
            if (!this.endpoint || !this.config) reject("Paypal not initialize")
            if (!this.credentials) reject("Invalid Credentials")
            const credentials = this.credentials
            const endpoint = `${this.endpoint}/v2/checkout/orders/${id}`
            await fetch(endpoint, {
                redirect: "follow",
                headers: {
                    "Authorization": `${credentials?.token_type} ${credentials?.access_token}`
                }
            })
                .then(e => e.json())
                .then(res => resolve(res))
                .catch(e => reject(e))
        })
    }
}