"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function md5(str) {
    return crypto
        .createHash('md5')
        .update(`${this.url}${this.selector}${this.intervel}${this.email}`)
        .digest('hex');
}
exports.md5 = md5;
//# sourceMappingURL=utils.js.map