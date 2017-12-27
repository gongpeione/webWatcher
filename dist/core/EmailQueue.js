"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
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
        const nextEmail = this.queue.pop();
    }
}
let emailQueue = new EmailQueue();
exports.default = emailQueue;
//# sourceMappingURL=EmailQueue.js.map