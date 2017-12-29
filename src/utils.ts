import * as crypto from 'crypto';

export function md5 (str: string) {
    return crypto
        .createHash('md5')
        .update(`${this.url}${this.selector}${this.intervel}${this.email}`)
        .digest('hex');
}