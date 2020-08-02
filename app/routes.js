const path = require('path');
const wsRouter = require('./gameService/wsRouter');

function setupRoutes(app){ // module start

    // index.html
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname +'/index.html'));
    });

    // Website Icon
    app.get('/favicon.ico', (req, res) => {
        res.sendFile(path.join(__dirname + '/../favicon.ico'));
    });

    // Websocket game connection
    app.ws('/game', function(ws, req){
        ws.on('message', function(msg){
            wsRouter.giveMessage(ws, msg);
        } );
    } );
}

module.exports = setupRoutes;
