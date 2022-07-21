const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const { htmlToText } = require('html-to-text');

class Email {
    constructor(to) {
        this.to = to
    }

    //connect to mail server
    newTransport() {
        return nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD
            }
        });
    }

    //send the actual mail
    async send(template,subject,mailData) {
        const html = pug.renderFile(path.join(__dirname,'..','views','emails',`${template}.pug`),
            mailData
        );

        await this.newTransport().sendMail({
            from: process.env.MAIL_FROM,
            to: this.to,
            subject: `${subject}`,
            html,
            text: htmlToText(html),
        });
    }

    async sendWelcome(name) {
        await this.send('welcome','welcome to our app',{ name });
    }

    async sendSales(order) {
        await this.send('sales',`You're boucher`,{ order });
    }
};

module.exports = { Email };