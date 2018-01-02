"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = require("body-parser");
const cookie_parser_1 = require("cookie-parser");
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = require("jsonwebtoken");
const utils_1 = require("./utils");
const WebWatcher_1 = require("./core/WebWatcher");
const path = require("path");
const ww_1 = require("./ww");
dotenv_1.default.config({
    path: path.resolve(__dirname, '../../.env')
});
const listFile = path.resolve(__dirname, '../list.json');
const app = express_1.default();
app.use(body_parser_1.default.json());
app.use(cookie_parser_1.default());
app.use('/static', express_1.default.static(path.resolve(__dirname, './view/static/')));
function isAuthenticated(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.WW_SECRET, (err, decoded) => {
            if (err) {
                res.redirect('/');
            }
            next();
        });
    }
}
app.get('/', function (req, res) {
    res.sendFile('./view/index.html', { "root": __dirname });
});
app.get('/login', (req, res) => {
    token = req.cookies.token;
    if (token) {
        jsonwebtoken_1.default.verify(token, process.env.WW_SECRET, (err, decoded) => {
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
    }
    else {
        res.json({
            code: -1,
            msg: "Your are not logged in yet."
        });
    }
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const pass = req.body.password;
    const encrypt = utils_1.md5(pass + utils_1.md5(process.env.WW_SALT));
    console.log(req.body, username, pass, encrypt, process.env.WW_ADMIN, process.env.WW_PASS);
    if (username === process.env.WW_ADMIN &&
        encrypt === process.env.WW_PASS) {
        const token = jsonwebtoken_1.default.sign({
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
    }
    else {
        res.json({
            code: -1,
            msg: "Login failed, check your username and password."
        });
    }
});
app.get('/list', isAuthenticated, (req, res) => {
    const list = [];
    for (let ww of ww_1.default) {
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
    const newList = req.body;
    newList.forEach(item => {
        ww_1.default.add(new WebWatcher_1.default(item.url));
    });
});
app.post('/toggleState', isAuthenticated, (req, res) => {
    const id = req.body.id;
    for (let ww of ww_1.default) {
        if (ww.id === id) {
            ww.running ? ww.stop() : ww.start();
            res.json({
                code: 1,
                msg: `[id: ${id}] ${ww.running ? 'Started' : 'Stopped'}.`
            });
        }
    }
});
app.listen(process.env.WW_PORT);
//# sourceMappingURL=start.js.map