"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
function md5(str) {
    return crypto
        .createHash('md5')
        .update(str)
        .digest('hex');
}
exports.md5 = md5;
function wwHash(ww) {
    return md5(`${ww.url}${ww.selector}${ww.intervel}${ww.email}${ww.webhook}`);
}
exports.wwHash = wwHash;
//# sourceMappingURL=utils.js.map