"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebWatcher_1 = require("./core/WebWatcher");
const WatcherMaster_1 = require("./core/WatcherMaster");
const timers_1 = require("timers");
const fs = require("fs");
const listFile = './list.json';
let listStr = fs.readFileSync(listFile, { encoding: 'utf8' });
let list = JSON.parse(listStr);
let wwList = [];
let timer = null;
init();
fs.watch(listFile, { encoding: 'utf8' }, (eventType, filename) => {
    const listNew = fs.readFileSync(listFile, { encoding: 'utf8' });
    if (listNew !== listStr) {
        listStr = listNew;
        list = JSON.parse(listStr);
        init();
    }
});
function init() {
    if (timer) {
        timers_1.clearInterval(timer);
    }
    list.forEach(item => {
        wwList.push(new WebWatcher_1.default(item.url, item.selector, {
            parseJs: item.parseJs,
            intervel: item.intervel,
            change(data) {
                console.log(`[WebWatcher] URL: ${item.url}, Selector: ${item.selector}, Data: ${data}`);
            },
            nochange() {
                console.log(`[WebWatcher] URL: ${item.url}, Selector: ${item.selector}, No Change`);
            }
        }));
    });
    WatcherMaster_1.default.removeAll();
    WatcherMaster_1.default.add(wwList);
    timer = timers_1.setInterval(() => {
        WatcherMaster_1.default.walk();
    }, 1000);
}
//# sourceMappingURL=index.js.map