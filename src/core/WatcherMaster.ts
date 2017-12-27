import WebWatcher from "./WebWatcher";
import EmailQueue from "./EmailQueue";

class WatcherMaster {
    private watchers: Array<WebWatcher> = [];
    constructor () {
    }

    add (ww: WebWatcher) {
        ww.addListener('data', data => {
            if (ww.email) {
                const email = ww.email;
                EmailQueue.add({
                    email,
                    content: data,
                    title: ''
                });
            }
        });
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