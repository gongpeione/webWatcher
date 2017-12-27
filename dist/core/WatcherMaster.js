"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmailQueue_1 = require("./EmailQueue");
class WatcherMaster {
    constructor() {
        this.watchers = [];
    }
    add(ww) {
        ww.addListener('data', data => {
            if (ww.email) {
                const email = ww.email;
                EmailQueue_1.default.add({
                    email,
                    content: data,
                    title: ''
                });
            }
        });
        this.watchers.push();
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