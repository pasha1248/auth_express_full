/** @format */
const nodemailer = require('nodemailer')

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD_NEW,
      },
    })
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: 'Activation user account' + process.env.API_URL,
      text: '',
      html: `
            <div>
            <h1>Click to activate</h1>
            <a href='${link}'>Link =)</a>
            </div>
         `,
    })
  }
}

module.exports = new MailService()
