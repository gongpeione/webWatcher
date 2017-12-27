import WebWatcher from './core/WebWatcher';
import master from './core/WatcherMaster';
import { setInterval } from 'timers';

const ww1 = new WebWatcher('https://code.geeku.net/', 'h1', {
    parseJs: true,
    intervel: 20000,
    change (data) {
        console.log('Geeku Callback:', data);
    },
    nochange () {
        console.log('Geeku No change');
    }
});
const ww2 = new WebWatcher('http://www.baidu.com/', 'title', {
    change (data) {
        console.log('Baidu Callback:', data);
    },
    nochange () {
        console.log('Baidu No change');
    }
});
master.add([ww1, ww2]);

let i = 0;
setInterval(() => {
    console.log('[Counter]: ', i++);
    master.walk();
}, 1000);