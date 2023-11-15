import { FormData } from "formdata-node"
const {
    SMS_API_KEY
} = process.env
export default class Twillio {
    sendMessage(data: { message: string, number: string }) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                const link = `https://semaphore.co/api/v4/priority`
                const form = new FormData()
                form.append("apikey", SMS_API_KEY)
                form.append("number", data.number)
                form.append("message", data.message)
                fetch(link, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    method: "POST",
                    body: `apikey=${SMS_API_KEY}&number=${data.number}&message=${data.message}`
                })
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