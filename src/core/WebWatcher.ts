import * as cheerio from 'cheerio';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EventEmitter } from 'events';
import * as puppeteer from 'puppeteer';
import * as https from 'https';

interface WebWatcherConfig extends AxiosRequestConfig {
    parseJs?: boolean,
    email?: string,
    change? (data: string): void,
    nochange? (data: string): void,
    intervel?: number // milliseconds
}
const defaultOptions: WebWatcherConfig = {
    method: 'get',
    timeout: 10000,  // milliseconds
    intervel: 10000,
    headers: {},
    parseJs: false
};

let browser: puppeteer.Browser;
(async () => {
    try {
        browser = await puppeteer.launch();
    } catch (e) {
        browser = null;
        console.log(e);
    }
})();

export default class WebWatcher extends EventEmitter {

    private oldContent: string = '';
    private url: string;
    private selector: string;
    private options: any;
    private http: AxiosInstance;
    private intervel: number;
    private lastRunTime: number;
    private inProcess: boolean;
    private page: puppeteer.Page = null;

    public email: string;
    
    constructor (url: string, selector: string, options?: WebWatcherConfig ) {
        super();
        this.url = url;
        this.selector = selector;
        const defaultOptCopy = JSON.parse(JSON.stringify(defaultOptions));
        this.options = Object.assign(defaultOptCopy, options);
        this.intervel = this.options.intervel;
        this.http = axios.create({
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

        if (this.options.parseJs) {
            if (!browser) {
                console.warn('No browser object found.');
            } else {
                (async () => {
                    this.page = await browser.newPage();
                })();
            }
        }
    }

    async request (): Promise<string> {
        if (this.options.parseJs && this.page) {
            await this.page.goto(this.url);
            const html = await this.page.evaluate(() => {
                return document.documentElement.innerHTML;
            });
            return html;
        } else {
            return await this.http.request({
                method: this.options.method,
                url: this.url
            }).then(res => {
                return res.data;
            });
        }
    }

    async run () {

        const currentTime = new Date().getTime();
        if (
            currentTime - this.lastRunTime < this.intervel ||
            this.inProcess
        ) {
            return;
        }

        // Try to create a new page again;
        if (this.options.parseJs && !this.page) {
            this.page = await browser.newPage();
        }
        
        this.lastRunTime = currentTime;
        this.inProcess = true;
        let webpageContent = '';
        try {
            webpageContent = await this.request();
        } catch (e) {
            console.log(e);
            webpageContent = this.oldContent;
        }
        this.currentContent(webpageContent);
    }

    currentContent (content: string) {
        // console.log(content);
        const $ = cheerio.load(content, { decodeEntities: false });
        const dist = $(this.selector).html();
        this.inProcess = false;
        if (this.oldContent === dist) {
            this.emit('nochange');
            return;
        } else {
            this.oldContent = dist;
            this.emit('change', dist);
        }
    }
}