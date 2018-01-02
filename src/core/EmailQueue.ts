import * as mailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import * as dotenv from 'dotenv';
import * as path from 'path';

export interface EmailObj {
    email: string;
    content: string;
    title: string;
}

dotenv.config({
    path: path.resolve('../../.env')
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
    from: `<${process.env.SMTP_EMAILADDR}>`, 
    to: 'aa@bb.com', 
    subject: 'Hello', 
    text: 'Hello world', 
    html: '<b>Hello world</b>' 
};


class EmailQueue {
    private queue: Array<EmailObj> = [];
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

        const nextEmail = this.queue.shift();
        if (!nextEmail) {
            return;
        }

        mailOptions.to = nextEmail.email;
        mailOptions.subject = nextEmail.title;
        mailOptions.text = nextEmail.content;
        mailOptions.html = `<p>${nextEmail.content}</p>`;

        transporter.sendMail(mailOptions, (error, info) => {
            this.inProcess = false;
            if (error) {
                return console.log(error);
            }
        });
    }
}

let emailQueue = new EmailQueue();

export default emailQueue;