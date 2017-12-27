import WebWatcher from "./WebWatcher";

class WatcherMaster {
    private watchers: Array<WebWatcher> = [];
    constructor () {
    }

    add (ww: WebWatcher) {
        this.watchers.push();
    }

    remove (ww: WebWatcher) {
        const index = this.watchers.indexOf(ww);
        return this.watchers.splice(index, 1);
    }

    walk () {
        this.watchers.forEach(watcher => {
            watcher.run();
        });
    }
}

export default new WatcherMaster();