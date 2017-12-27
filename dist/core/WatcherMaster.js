"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmailQueue_1 = require("./EmailQueue");
function addEmailQueue(ww) {
    ww.addListener('change', data => {
        if (ww.email) {
            const email = ww.email;
            EmailQueue_1.default.add({
                email,
                content: data,
                title: ''
            });
        }
    });
}
class WatcherMaster {
    constructor() {
        this.watchers = [];
    }
    add(ww) {
        if (Array.isArray) {
            ww.forEach(ww => {
                addEmailQueue(ww);
            });
            this.watchers.push(...ww);
        }
        else {
            addEmailQueue(ww);
            this.watchers.push(ww);
        }
    }
    remove(ww) {
        const index = this.watchers.indexOf(ww);
        return this.watchers.splice(index, 1);
    }
    walk() {
        this.watchers.forEach(watcher => {
            watcher.run();
        });
    }
}
exports.default = new WatcherMaster();
//# sourceMappingURL=WatcherMaster.js.map