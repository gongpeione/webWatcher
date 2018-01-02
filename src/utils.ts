import * as crypto from 'crypto';
import WebWatcher from './core/WebWatcher';

export function md5 (str: string) {
    return crypto
        .createHash('md5')
        .update(str)
        .digest('hex');
}

export function wwHash (ww: WebWatcher) {
    return md5(`${ww.url}${ww.selector}${ww.intervel}${ww.email}${ww.webhook}`);
}