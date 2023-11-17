import { FormData } from "formdata-node"
import { parsePhoneNumber } from 'libphonenumber-js'
const {
    SMS_API_KEY,
    SMS_CHEF_API_KEY,
    SMS_CHEF_DEVICE_ID
} = process.env
export default class Twillio {
    sendMessage(data: { message: string, number: string }) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                // const link = `https://semaphore.co/api/v4/priority`
                // const form = new FormData()
                // form.append("apikey", SMS_API_KEY)
                // form.append("number", data.number)
                // form.append("message", data.message)
                // fetch(link, {
                //     headers: {
                //         "Content-Type": "application/x-www-form-urlencoded"
                //     },
                //     method: "POST",
                //     body: `apikey=${SMS_API_KEY}&number=${data.number}&message=${data.message}`
                // })
                //     .then(response => response.json())
                //     .then(result => {
                //         console.log(result)
                //         resolve(result)
                //     })
                //     .catch(error => {
                //         console.log(error)
                //         reject(error)
                //     });
                const formatted_number = parsePhoneNumber(data.number, "PH")
                console.log(formatted_number)
                const link = `https://www.cloud.smschef.com/api/send/sms?shortener=1&secret=${SMS_CHEF_API_KEY}&mode=devices&device=${SMS_CHEF_DEVICE_ID}&sim=1&priority=1&phone=${formatted_number.number}&message=${data.message}`
                fetch(link, { method: "POST", })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result)
                        resolve(result)
                    })
                    .catch(error => {
                        console.log(error)
                        reject(error)
                    });
            } catch (e) {
                reject(e)
            }
        })
    }
}   