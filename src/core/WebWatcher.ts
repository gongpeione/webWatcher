import * as cheerio from 'cheerio';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EventEmitter } from 'events';
import * as puppeteer from 'puppeteer';

interface WebWatcherConfig extends AxiosRequestConfig {
    parseJs: boolean,
    email?: string,
}
const defaultOptions: WebWatcherConfig = {
    method: 'get',
    timeout: 10000,
    headers: {},
    parseJs: false
};

export default class WebWatcher extends EventEmitter {

    private oldContent: string = '';
    private url: string;
    private selector: string;
    private options: any;
    private http: AxiosInstance;
    public email: string;

    constructor (url: string, selector: string, options?: WebWatcherConfig ) {
        super();
        this.url = url;
        this.selector = selector;
        const defaultOptCopy = JSON.parse(JSON.stringify(defaultOptions));
        this.options = Object.assign(defaultOptCopy, options);
        this.http = axios.create({
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

    async request (): Promise<string> {
        if (this.options.parseJs) {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(this.url);
            const bodyHandle = await page.$('body');
            const body = await page.evaluate(() => {
                return document.querySelector('h1').innerText;
            });
            return body;
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
        let webpageContent = '';
        try {
            webpageContent = await this.request();
        } catch (e) {
            console.log(e);
            webpageContent = this.oldContent;
        }
        console.log(webpageContent);
        // this.currentContent(webpageContent);
    }

    currentContent (content: string) {
        // const $ = cheerio.load(content);
        // const dist = $(this.selector).text();
        // console.log(content);
        // if (this.oldContent === dist) {
        //     return;
        // } else {
        //     this.emit('data', dist);
        // }
    }
}