import WebWatcher from './core/WebWatcher';
import master from './core/WatcherMaster';
import { setInterval } from 'timers';

const ww = new WebWatcher('https://code.geeku.net/', 'title', {
    parseJs: true
});
ww.run();
// master.add(ww);

// setInterval(() => {
//     master.walk();
// }, 1000);