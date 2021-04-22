const path = require('path');
const wsRouter = require('./gameService/wsRouter');

function setupRoutes(app) {
    // module start

    // Scripts
    app.get('/GameWebSocket.js', function (req, res) {
        res.sendFile(path.join(__dirname + '/GameWebSocket.js'));
    });

    app.get('/main.js', function (req, res) {
        res.sendFile(path.join(__dirname + '/../../dist/main.js'));
    });

    app.get('/test.js', function (req, res) {
        res.sendFile(path.join(__dirname + '/test.js'));
    });

    // index.html
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/../frontend/index.html'));
    });

    // Website Icon
    app.get('/favicon.ico', (req, res) => {
        res.sendFile(path.join(__dirname + '/../../favicon.ico'));
    });

    // Websocket game connection
    app.ws('/game', function (ws, req) {
        ws.on('message', function (msg) {
            wsRouter.giveMessage(ws, msg);
        });
    });
}

module.exports = setupRoutes;
