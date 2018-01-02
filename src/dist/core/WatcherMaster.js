"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmailQueue_1 = require("./EmailQueue");
const fs = require("fs");
const path = require("path");
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
const NOT_EDITABLE = [
    'id'
];
class WatcherMaster {
    constructor() {
        this.watchers = [];
        this.hashToIndex = {};
    }
    *[Symbol.iterator]() {
        for (let ww of this.watchers) {
            yield ww;
        }
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
    update(ww, options) {
        for (let key in options) {
            if (NOT_EDITABLE.indexOf(key) >= 0) {
                continue;
            }
            switch (key) {
                case 'running': {
                    break;
                }
            }
        }
        this.updateFile();
    }
    updateFile() {
        const list = [];
        for (let ww of this) {
            list.push({
                id: ww.id,
                url: ww.url,
                email: ww.email,
                webhook: ww.webhook,
                intervel: ww.intervel,
                selector: ww.selector,
                running: ww.running
            });
        }
        fs.writeFileSync(path.resolve(__dirname, './list.json'), JSON.stringify(list), {
            encoding: 'utf8'
        });
    }
}
exports.default = new WatcherMaster();
//# sourceMappingURL=WatcherMaster.js.map