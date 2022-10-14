// ************************ Server Setup ******************************

const https = require('https');
const express = require('express');
const path = require('path');

const app = express();
var expressWs = require('express-ws')(app);

require('./routes')(app);


app.use(express.static(process.cwd() + '/public'));
app.use(express.json());

// ************************ Run Server ******************************
const port = process.env.PORT || 5656;

app.listen(port, () => {
    console.log(`https://localhost:${port}`);
});
