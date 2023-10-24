import { PaypalConfig, CreateOrder, CreateOrderResponse, CapturePayment, PaymentDetails, Refund, Credentials } from "@/types"
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
    refund(id: string) {
        return new Promise<Refund>(async (resolve, reject) => {
            if (!this.endpoint || !this.config) reject("Paypal not initialize")
            if (!this.credentials) reject("Invalid Credentials")
            const credentials = this.credentials
            const endpoint = `${this.endpoint}/v2/payments/captures/${id}/refund`
            await fetch(endpoint, {
                redirect: "follow",
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `${credentials?.token_type} ${credentials?.access_token}`
                }
            })
                .then(e => e.json())
                .then(res => resolve(res))
                .catch(e => reject(e))
        })
    }
}