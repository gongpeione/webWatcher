"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EmailQueue {
    constructor() {
        this.queue = [];
    }
    add(email) {
        this.queue.push(email);
    }
}
let queueInstance = new EmailQueue();
exports.default = queueInstance;
//# sourceMappingURL=Queue.js.map