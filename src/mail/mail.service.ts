import nodemailer from 'nodemailer'

class MailService {
  transporter: ReturnType<nodemailer.createTransport>

  constructor () {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'tressa.douglas@ethereal.email',
        pass: process.env.SMTP_PASSWORD || 'hw8yFeUBn6P5mtJYEn'
      }
    })
  }

  async sendActivationMail (to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта на ' + process.env.API_URL,
      text: '',
      html:
        `
                    <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
    })

  }
}

export default new MailService()