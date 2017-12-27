const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

const listFile = '../list.json';

app.use(bodyParser.text());

app.get('/', function (req, res) {
    res.sendFile('./index.html', {"root": __dirname});
});

app.get('/list', (req, res) => {
    const list = fs.readFile(listFile, (err, data) => {
        if (err) {
            return console.log(err);
        }
        res.json(JSON.parse(data));
    }) 
});

app.post('/list', (req, res) => {
    fs.writeFile(listFile, req.body, {encoding: 'utf8'}, err => {
        if (err) {
            res.json({code: -1, msg: err});
        }
        res.json({code: 1});
    });
});

app.listen(3000);