import * as cheerio from 'cheerio';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EventEmitter } from 'events';

interface WebWatcherConfig extends AxiosRequestConfig {
    intervel: 10000, // 10s
    parseJs: boolean
}
const defaultOptions: WebWatcherConfig = {
    method: 'get',
    intervel: 10000, // 10s
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

    constructor (url: string, selector: string, options?: WebWatcherConfig ) {
        super();
        this.url = url;
        this.selector = selector;
        const defaultOptCopy = JSON.parse(JSON.stringify(defaultOptions));
        this.options = Object.assign(defaultOptCopy, options);
        this.http = axios.create({
            timeout: this.options.timeout,
        });
    }

    async run () {
        let webpageContent = '';
        try {
            webpageContent = await this.http.request({
                method: this.options.method,
                url: this.url
            }).then(res => {
                return res.data;
            });
        } catch (e) {
            webpageContent = this.oldContent;
        }

        this.currentContent(webpageContent);
    }

    currentContent (content: string) {
        const $ = cheerio.load(content);
        const dist = $(this.selector).text();
        if (this.oldContent === dist) {
            return;
        } else {
            this.emit('data', dist);
        }
    }
}