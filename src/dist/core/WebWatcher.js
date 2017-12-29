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
const events_1 = require("events");
const puppeteer = require("puppeteer");
const https = require("https");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const defaultOptions = {
    method: 'get',
    timeout: 10000,
    intervel: 10000,
    headers: {},
    parseJs: false
};
let browser;
(() => __awaiter(this, void 0, void 0, function* () {
    try {
        browser = yield puppeteer.launch({
            args: ['--no-sandbox'],
            ignoreHTTPSErrors: true
        });
    }
    catch (e) {
        browser = null;
        console.log(e);
    }
}))();
class WebWatcher extends events_1.EventEmitter {
    constructor(url, selector, options) {
        super();
        this.lastContent = '';
        this.lastRunTime = 0;
        this.inProcess = false;
        this.page = null;
        this.url = url;
        this.selector = selector;
        const defaultOptCopy = JSON.parse(JSON.stringify(defaultOptions));
        this.options = Object.assign(defaultOptCopy, options);
        this.intervel = this.options.intervel;
        this.hash = crypto
            .createHash('md5')
            .update(`${this.url}${this.selector}${this.intervel}${this.email}`)
            .digest('hex');
        this.http = axios_1.default.create({
            timeout: this.options.timeout,
            headers: this.options.headers,
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
        if (this.options.email) {
            this.email = this.options.email;
        }
        if (this.options.change) {
            this.addListener('change', this.options.change);
        }
        if (this.options.nochange) {
            this.addListener('nochange', this.options.nochange);
        }
        const hashFilePath = path.resolve(`./.cache/${this.hash}`);
        if (!fs.existsSync(hashFilePath)) {
            fs.writeFileSync(hashFilePath, '');
        }
        this.last = fs.readFileSync(path.resolve(`./.cache/${this.hash}`), { encoding: 'utf8' }) || '{}';
        this.last = JSON.parse(this.last);
        if (this.options.parseJs) {
            if (!browser) {
                console.warn('No browser object found.');
            }
            else {
                (() => __awaiter(this, void 0, void 0, function* () {
                    this.page = yield browser.newPage();
                }))();
            }
        }
    }
    request() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.options.parseJs && this.page) {
                yield this.page.goto(this.url);
                const html = yield this.page.evaluate(() => {
                    return document.documentElement.innerHTML;
                });
                return html;
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
            const currentTime = new Date().getTime();
            if (this.last &&
                currentTime - this.lastRunTime < this.intervel ||
                this.inProcess) {
                return;
            }
            if (this.options.parseJs && !this.page) {
                this.page = yield browser.newPage();
            }
            this.lastRunTime = this.last.lastRunTime = currentTime;
            this.inProcess = true;
            let webpageContent = '';
            try {
                webpageContent = yield this.request();
            }
            catch (e) {
                console.log(e);
                webpageContent = this.lastContent;
            }
            this.currentContent(webpageContent);
        });
    }
    currentContent(content) {
        const $ = cheerio.load(content, { decodeEntities: false });
        const dist = $(this.selector).html();
        this.inProcess = false;
        if (this.lastContent === dist ||
            this.last.lastContent === dist) {
            this.emit('nochange');
            return;
        }
        else {
            this.lastContent = this.last.lastContent = dist;
            this.emit('change', dist);
            fs.writeFile(`./.cache/${this.hash}`, JSON.stringify(this.last), e => e);
        }
    }
}
exports.default = WebWatcher;
//# sourceMappingURL=WebWatcher.js.map