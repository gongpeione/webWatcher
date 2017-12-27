import WebWatcher from "./WebWatcher";
import EmailQueue, {EmailObj} from "./EmailQueue";

function addEmailQueue (ww: WebWatcher) {
    if (!ww.email) {
        return;
    }
    ww.addListener('change', data => {
        const email = ww.email;
        EmailQueue.add({
            email,
            content: data,
            title: `"${ww.url}" content have been changed.`
        } as EmailObj);
    });
}

class WatcherMaster {
    private watchers: Array<WebWatcher> = [];
    constructor () {
    }

    add (ww: WebWatcher | Array<WebWatcher>) {
        if (Array.isArray) {
            (ww as Array<WebWatcher>).forEach(ww => {
                addEmailQueue(ww);
            });
            this.watchers.push(...ww as Array<WebWatcher>);
        } else {
            addEmailQueue(ww as WebWatcher);
            this.watchers.push(ww as WebWatcher);
        }
    }

    remove (ww: WebWatcher) {
        const index = this.watchers.indexOf(ww);
        return this.watchers.splice(index, 1);
    }

    removeAll () {
        this.watchers = [];
    }

    walk () {
        this.watchers.forEach(watcher => {
            watcher.run();
        });
    }
}

export default new WatcherMaster();