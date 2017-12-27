"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebWatcher_1 = require("./core/WebWatcher");
const ww = new WebWatcher_1.default('https://code.geeku.net/', 'title', {
    parseJs: true
});
ww.run();
//# sourceMappingURL=index.js.map