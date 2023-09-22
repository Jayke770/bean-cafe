import { createTransport, Transporter } from 'nodemailer'
const { OUTLOOK_USERNAME, OUTLOOK_PASSWORD } = process.env
export default class Email {
    private transporter?: Transporter
    private senderName?: string
    constructor(senderName?: string) {
        this.transporter = createTransport({
            host: "smtp.office365.com",
            service: "Outlook365",
            port: 587,
            secure: true,
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false,
            },
            auth: {
                user: OUTLOOK_USERNAME,
                pass: OUTLOOK_PASSWORD
            }
        })
        this.senderName = `${senderName} ${OUTLOOK_USERNAME}`
    }
    send({ receiver, subject, body }: { receiver: string, subject: string, body: string }) {
        try {
            if (this.transporter) {
                this.transporter.sendMail({
                    from: this.senderName,
                    to: receiver,
                    subject: subject,
                    html: body,
                })
            } else {
                throw new Error("Invalid Transporter")
            }
        } catch (e) {
            console.error(e)
        }
    }
}