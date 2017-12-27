"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebWatcher_1 = require("./core/WebWatcher");
const WatcherMaster_1 = require("./core/WatcherMaster");
const timers_1 = require("timers");
const ww1 = new WebWatcher_1.default('https://code.geeku.net/', 'h1', {
    parseJs: true,
    intervel: 20000,
    change(data) {
        console.log('Geeku Callback:', data);
    },
    nochange() {
        console.log('Geeku No change');
    }
});
const ww2 = new WebWatcher_1.default('http://www.baidu.com/', 'title', {
    change(data) {
        console.log('Baidu Callback:', data);
    },
    nochange() {
        console.log('Baidu No change');
    }
});
WatcherMaster_1.default.add([ww1, ww2]);
let i = 0;
timers_1.setInterval(() => {
    console.log('[Counter]: ', i++);
    WatcherMaster_1.default.walk();
}, 1000);
//# sourceMappingURL=test.js.map