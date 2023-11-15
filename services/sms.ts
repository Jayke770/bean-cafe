const {
    SMS_API_KEY
} = process.env
export default class Twillio {
    sendMessage(data: { message: string, number: string }) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                fetch(`https://semaphore.co/api/v4/messages?apikey=${SMS_API_KEY}&number=${data.number.replace("+63", "0")}&message=${data.message}`, {
                    method: 'POST',
                })
                    .then(response => response.json())
                    .then(result => {
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