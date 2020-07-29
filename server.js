const http = require('http');
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static("express"));
const port = process.env.PORT || 5656;


app.listen(port, () => {console.log(`http://localhost:${port}`);});


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/express/index.html'));
});

