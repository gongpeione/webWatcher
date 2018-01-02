import * as path from 'path';
import * as fs from 'fs';

const root = path.resolve(__dirname);
const cache = path.resolve(root, './.cache/');

if (!fs.existsSync(cache)) {
    fs.mkdirSync(cache);
}

export default {
    root,
    env: path.resolve(root, '../.env'),
    list: path.resolve(root, './list.json'),
    cache
}