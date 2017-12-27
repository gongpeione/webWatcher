"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio = require("cheerio");
const axios_1 = require("axios");
const defaultOptions = {
    method: 'get',
    intervel: 10000,
    timeout: 10000,
    headers: {}
};
class WebWatcher {
    constructor(url, selector, options) {
        this.oldContent = '';
        this.url = url;
        this.selector = selector;
        const defaultOptCopy = JSON.parse(JSON.stringify(defaultOptions));
        this.options = Object.assign(defaultOptCopy, options);
        this.http = axios_1.default.create({
            timeout: this.options.timeout,
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let webpageContent = '';
            try {
                webpageContent = yield this.http.request({
                    method: this.options.method,
                    url: this.url
                }).then(res => {
                    return res.data;
                });
            }
            catch (e) {
                webpageContent = '';
            }
            this.currentContent(webpageContent);
        });
    }
    currentContent(content) {
        const $ = cheerio.load(content);
        const dist = $(this.selector).text();
        console.log(dist);
    }
}
exports.default = WebWatcher;
//# sourceMappingURL=index.js.map