"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebWatcher_1 = require("./core/WebWatcher");
const WatcherMaster_1 = require("./core/WatcherMaster");
const timers_1 = require("timers");
const fs = require("fs");
const path = require("path");
const listFile = path.resolve(__dirname, '../list.json');
let listStr = fs.readFileSync(listFile, { encoding: 'utf8' });
let list = JSON.parse(listStr);
let wwList = [];
let timer = null;
init();
function init() {
    if (timer) {
        timers_1.clearInterval(timer);
    }
    list.forEach(item => {
        wwList.push(new WebWatcher_1.default(item.url, item.selector, {
            parseJs: item.parseJs,
            intervel: item.intervel,
            email: item.email,
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
}
exports.default = WatcherMaster_1.default;
//# sourceMappingURL=ww.js.map