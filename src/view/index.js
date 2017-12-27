const express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.sendFile('./index.html', {"root": __dirname});
});

app.get('/list', (req, res) => {
    res.json([{
        url: 'https://code.geeku.net',
        selector: 'h1',
        parseJs: true
    }]);
});

app.listen(3000);