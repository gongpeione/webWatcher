const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const md5 = require('./dist/utils').md5;

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

const listFile = path.resolve(__dirname, './list.json');
const master = require(path.resolve(__dirname, './dist/ww')).default;
 
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/static', express.static(path.resolve(__dirname, './view/static/')));

function isAuthenticated (req, res, next) {
    token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.WW_SECRET, (err, decoded) => {
            if (err) { res.redirect('/'); }
            next();
        });
    }
}

app.get('/', function (req, res) {
    res.sendFile('./view/index.html', {"root": __dirname});
});

app.get('/login', (req, res) => {
    token = req.cookies.token;
    if (token) {
        jwt.verify(token, process.env.WW_SECRET, (err, decoded) => {
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
    fs.writeFile(listFile, req.body, {encoding: 'utf8'}, err => {
        if (err) {
            res.json({code: -1, msg: err});
        }
        res.json({code: 1});
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

app.listen(process.env.WW_PORT);