# webWatcher


## Quick Start

```javascript
import WebWatcher from './core/WebWatcher';
import master from './core/WatcherMaster';
const ww = new WebWatcher('https://code.geeku.net/', 'title', {
    change (data) {
        console.log('Geeku Callback:', data);
    },
    nochange () {
        console.log('Geeku No change');
    }
});
master.add([ww]);

let i = 0;
setInterval(() => {
    console.log('[Counter]: ', i++);
    master.walk();
}, 1000);
```

Output:

```
Geeku Callback: 技术树
Geeku No change
```