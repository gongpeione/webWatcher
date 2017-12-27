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
const axios_1 = require("axios");
const events_1 = require("events");
const puppeteer = require("puppeteer");
const defaultOptions = {
    method: 'get',
    timeout: 10000,
    headers: {},
    parseJs: false
};
class WebWatcher extends events_1.EventEmitter {
    constructor(url, selector, options) {
        super();
        this.oldContent = '';
        this.url = url;
        this.selector = selector;
        const defaultOptCopy = JSON.parse(JSON.stringify(defaultOptions));
        this.options = Object.assign(defaultOptCopy, options);
        this.http = axios_1.default.create({
            timeout: this.options.timeout,
            headers: this.options.headers
        });
        if (this.options.email) {
            this.email = this.options.email;
        }
        if (this.options.callback) {
            this.addListener('data', data => {
                this.options.callback.call(data);
            });
        }
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.parseJs) {
                const browser = yield puppeteer.launch();
                const page = yield browser.newPage();
                yield page.goto(this.url);
                const bodyHandle = yield page.$('body');
                const body = yield page.evaluate(() => {
                    return document.querySelector('h1').innerText;
                });
                return body;
            }
            else {
                return yield this.http.request({
                    method: this.options.method,
                    url: this.url
                }).then(res => {
                    return res.data;
                });
            }
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let webpageContent = '';
            try {
                webpageContent = yield this.request();
            }
            catch (e) {
                console.log(e);
                webpageContent = this.oldContent;
            }
            console.log(webpageContent);
        });
    }
    currentContent(content) {
    }
}
exports.default = WebWatcher;
//# sourceMappingURL=WebWatcher.js.map