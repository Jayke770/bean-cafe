import twilio, { Twilio } from 'twilio'
import type { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message'
const {
    TWILLIO_ACCOUNT_SID,
    TWILLIO_ACCOUNT_AUTH_TOKEN,
    TWILLIO_NUMBER
} = process.env
export default class Twillio {
    private client?: Twilio
    constructor() {
        this.client = twilio(TWILLIO_ACCOUNT_SID, TWILLIO_ACCOUNT_AUTH_TOKEN)
    }
    sendMessage(data: { message: string, number: string }) {
        return new Promise<MessageInstance>(async (resolve, reject) => {
            try {
                if (this.client) {
                    this.client.numbers.v2.list()
                    this?.client?.messages.create({
                        body: data.message,
                        from: TWILLIO_NUMBER,
                        to: data.number
                    }).then(e => {
                        resolve(e)
                        console.log(e)
                    }).catch(e => reject(e))
                } else {
                    reject("Invalid Client")
                }
            } catch (e) {
                reject(e)
            }
        })
    }
}   