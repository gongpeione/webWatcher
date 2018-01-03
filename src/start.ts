import * as express from 'express';
import fs from 'fs';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import { md5 } from './utils';
import WebWatcher from './core/WebWatcher';
import * as path from 'path';
import master from './ww';
import Paths from './Paths';

dotenv.config({
    path: Paths.env
});

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, './view/build/')));

function isAuthenticated (req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.WW_SECRET, (err: any, decoded: string) => {
            if (err) { res.redirect('/'); }
            next();
        });
    }
}

app.get('/', function (req, res) {
    res.sendFile('./view/build/index.html', {"root": __dirname});
});

app.get('/login', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.WW_SECRET, (err: any, decoded: string) => {
            if (err) {
                res.json({
                    code: -1,
                    msg: "Your are not logged in yet."
                });
            }
            res.json({
                code: 1,
                msg: "Your are logged in."
            });
        });
    } else {
        res.json({
            code: -1,
            msg: "Your are not logged in yet."
        });
    }
});

app.post('/login', (req, res) => {

    // req.body = JSON.parse(req.body);
    const username = req.body.username;
    const pass = req.body.password;
    const encrypt = md5(pass + md5(process.env.WW_SALT));
    console.log(req.body, username, pass, encrypt, process.env.WW_ADMIN, process.env.WW_PASS)
    if (
        username === process.env.WW_ADMIN &&
        encrypt === process.env.WW_PASS
    ) {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            login: true
        }, process.env.WW_SECRET);
        res.cookie('token', token, { 
            httpOnly: true,
            expires: new Date(Date.now() + (60 * 60 * 24 * 1000))
        });
        res.json({
            code: 1,
            msg: "Login successful."
        });
    } else {
        res.json({
            code: -1,
            msg: "Login failed, check your username and password."
        });
    }
});

app.get('/list', isAuthenticated, (req, res) => {
    const list = [];
    for (let ww of master) {
        list.push({
            id: ww.id,
            url: ww.url,
            email: ww.email,
            webhook: ww.webhook,
            intervel: ww.intervel,
            selector: ww.selector,
            running: ww.running
        });
    }
    res.json(list);
});

app.post('/list', isAuthenticated, (req, res) => {
    let newList = req.body;
    if (!Array.isArray(newList)) {
        newList = [newList];
    }
    newList.forEach((item: any)=> {
        master.add(new WebWatcher(item.url, item.selector, {
            email: item.email,
            webhook: item.webhook,
            intervel: item.intervel,
        }));
    });

    master.updateFile();

    res.json({
        code: 1,
        msg: "Add successful."
    });
});

app.post('/toggleState', isAuthenticated, (req, res) => {
    const id = req.body.id;
    for (let ww of master) {
        if (ww.id === id) {
            ww.running ? ww.stop() : ww.start();
            res.json({
                code: 1,
                msg: `[id: ${id}] ${ ww.running ? 'Started' : 'Stopped' }.`
            });
        }
    }
});

app.post('/remove', isAuthenticated, (req, res) => {
    const id = req.body.id;
    const targetWW = [...master].filter(ww => ww.id === id)[0];
    if (targetWW) {
        master.remove(targetWW);
        res.json({
            code: 1,
            msg: `[id: ${id}] Removed.`
        });
        return;
    }
    res.json({
        code: -1,
        msg: `[id: ${id}] Not exists.`
    });
});

app.listen(process.env.WW_PORT || 3000);