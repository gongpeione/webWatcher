"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmailQueue_1 = require("./EmailQueue");
function addEmailQueue(ww) {
    if (!ww.email) {
        return;
    }
    ww.addListener('change', data => {
        const email = ww.email;
        EmailQueue_1.default.add({
            email,
            content: data,
            title: `"${ww.url}" content have been changed.`
        });
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
    removeAll() {
        this.watchers = [];
    }
    walk() {
        this.watchers.forEach(watcher => {
            watcher.run();
        });
    }
}
exports.default = new WatcherMaster();
//# sourceMappingURL=WatcherMaster.js.map