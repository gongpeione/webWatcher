"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WatcherMaster {
    constructor() {
        this.watchers = [];
    }
    add(ww) {
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