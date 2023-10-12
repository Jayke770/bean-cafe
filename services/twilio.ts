const {
    TWILLIO_ACCOUNT_SID,
    TWILLIO_ACCOUNT_AUTH_TOKEN,
    TWILLIO_NUMBER
} = process.env
export default class Twillio {
    sendMessage(data: { message: string, number: string }) {
        return new Promise<any>(async (resolve, reject) => {
            try {
                var myHeaders = new Headers();
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
                myHeaders.append("Authorization", `Basic ${Buffer.from(`${TWILLIO_ACCOUNT_SID}:${TWILLIO_ACCOUNT_AUTH_TOKEN}`).toString('base64')}`);
                var urlencoded = new URLSearchParams();
                urlencoded.append("Body", data.message);
                urlencoded.append("To", data.number);
                urlencoded.append("From", TWILLIO_NUMBER ?? "");
                fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILLIO_ACCOUNT_SID}/Messages.json`, {
                    method: 'POST',
                    headers: myHeaders,
                    body: urlencoded,
                    redirect: 'follow'
                })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result)
                        resolve(result)
                    })
                    .catch(error => reject(error));
            } catch (e) {
                reject(e)
            }
        })
    }
}   