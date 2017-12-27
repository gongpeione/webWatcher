"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({
    path: path.resolve('../.env')
});
const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: !!process.env.SMTP_SECURE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};
let transporter = mailer.createTransport(smtpConfig);
let mailOptions = {
    from: '"Fred Foo 👻" <403075093@qq.com>',
    to: '403075093@qq.com',
    subject: 'Hello ✔',
    text: 'Hello world?',
    html: '<b>Hello world?</b>'
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
});
class EmailQueue {
    constructor() {
        this.queue = [];
        this.inProcess = false;
    }
    add(email) {
        this.queue.push(email);
    }
    walk() {
        if (this.inProcess) {
            return;
        }
        const nextEmail = this.queue.unshift();
    }
}
let emailQueue = new EmailQueue();
exports.default = emailQueue;
//# sourceMappingURL=EmailQueue.js.map