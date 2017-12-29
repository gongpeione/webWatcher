import WebWatcher from './core/WebWatcher';
import master from './core/WatcherMaster';
import { setInterval, clearInterval } from 'timers';
import * as fs from 'fs';
import EmailQueue from './core/EmailQueue';
import * as path from 'path';

const listFile = path.resolve(__dirname, '../list.json');
let listStr = fs.readFileSync(listFile, {encoding: 'utf8'});
let list: Array<any> = JSON.parse(listStr);
let wwList: Array<WebWatcher> = [];
let timer: NodeJS.Timer = null;

init();

fs.watch(listFile, { encoding: 'utf8' }, (eventType, filename) => {
    const listNew = fs.readFileSync(listFile, {encoding: 'utf8'});
    if (listNew !== listStr) {
        listStr = listNew;
        list = JSON.parse(listStr);
        init();
    }
});

function init () {
    if (timer) {
        clearInterval(timer);
    }
    list.forEach(item => {
        wwList.push(new WebWatcher(item.url, item.selector, {
            parseJs: item.parseJs,
            intervel: item.intervel,
            email: item.email,
            change (data) {
                console.log(`[WebWatcher] URL: ${item.url}, Selector: ${item.selector}, Data: ${data}`);
            },
            nochange () {
                console.log(`[WebWatcher] URL: ${item.url}, Selector: ${item.selector}, No Change`);
            }
        }));
    });
    master.removeAll();
    master.add(wwList);
    
    timer = setInterval(() => {
        master.walk();
        EmailQueue.walk();
    }, 1000);
}

export default master;