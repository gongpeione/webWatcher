const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const jwt = require('jsonwebtoken');
const md5 = require('./dist/utils').md5;

dotenv.config({
    path: path.resolve(__dirname, './.env')
});

const listFile = path.resolve(__dirname, './list.json');
const master = require(path.resolve(__dirname, './dist/ww'));
 
app.use(bodyParser.text());

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
    }
});

app.post('/login', (req, res) => {

    const username = req.body.username;
    const pass = req.body.pass;
    const encrypt = md5(pass + md5(process.env.WW_SALT));
    if (
        username === process.env.WW_ADMIN &&
        encrypt === process.env.WW_PASS
    ) {
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
            login: true
        }, process.env.WW_SECRET);
        res.json({

        });
    }
});

app.get('/list', (req, res) => {
    const list = fs.readFile(listFile, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.json(JSON.parse(data));
    });
});

app.post('/list', (req, res) => {
    fs.writeFile(listFile, req.body, {encoding: 'utf8'}, err => {
        if (err) {
            res.json({code: -1, msg: err});
        }
        res.json({code: 1});
    });
});

app.listen(process.env.WW_PORT);