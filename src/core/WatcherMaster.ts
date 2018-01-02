import WebWatcher from "./WebWatcher";
import EmailQueue, {EmailObj} from "./EmailQueue";
import * as fs from 'fs';
import * as path from 'path';

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

const NOT_EDITABLE = [
    'id'
];

class WatcherMaster {
    private watchers: Array<WebWatcher> = [];
    private hashToIndex: {[key: string]: number} = {};
    constructor () {
    }

    *[Symbol.iterator] () {
        for (let ww of this.watchers) {
            yield ww;
        }
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

    update (ww: WebWatcher, options: any) {
        for (let key in options) {
            if (NOT_EDITABLE.indexOf(key) >= 0) {
                continue;
            }
            switch (key) {
                case 'running': {
                    break;
                }
            }
            if ((ww as Object).hasOwnProperty(key)) {
                (ww as any)[key] = options[key];
            }
        }
        this.updateFile();
    }

    updateFile () {
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

export default new WatcherMaster();