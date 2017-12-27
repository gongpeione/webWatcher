import * as mailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import * as dotenv from 'dotenv';
import * as path from 'path';

interface EmailObj {
    email: string;
    content: string;
    title: string;
}

dotenv.config({
    path: path.resolve('../.env')
})

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
    from: '"Fred Foo 👻" <403075093@qq.com>', // sender address
    to: '403075093@qq.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
});

class EmailQueue {
    private queue: Array<any> = [];
    public inProcess: boolean = false;
    constructor () {
    }

    add (email: EmailObj) {
        this.queue.push(email);
    }

    walk () {
        if (this.inProcess) {
            return;
        }
        const nextEmail = this.queue.unshift();
    }
}

let emailQueue = new EmailQueue();

export default emailQueue;