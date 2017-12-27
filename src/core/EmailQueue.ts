import mailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import * as dotenv from 'dotenv';

interface EmailObj {
    email: string;
    content: string;
    title: string;
}

dotenv.config();

// const SMTPConfig = `
// smtps://${process.env.SMTP_USER}:/${process.env.SMTP_PASS}@/${process.env.SMTP_HOST}/?pool=true
// `

// let transporter = mailer.createTransport(SMTPConfig);

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
        const nextEmail = this.queue.pop();

    }
}

let emailQueue = new EmailQueue();

export default emailQueue;