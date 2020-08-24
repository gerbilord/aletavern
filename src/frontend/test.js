//*******************************************************

var input = document.getElementById("sMessage");
var output = document.getElementById("messages");

var gameWebSocket = new GameWebSocket(true);


// ***************** Event listeners *******************************
// Pressing enter will default to "sendMessage()"
input.addEventListener("keydown", function(event){
    if (event.keyCode === 13)
    {
        event.preventDefault();
        document.getElementById("sendMessageToAll").click();
    }
});

// Listen for messages


// ********************* BUTTON FUNCTIONS ****************************

function createGame(){
    gameWebSocket.createGame("The_gameType");
}

function joinGame(){
    gameWebSocket.joinGame(getAndClearInput());
}

function sendMessageToAll(msg){
    gameWebSocket.sendMessageToAll(getAndClearInput());
}

function sendMessageToHost(msg){
    gameWebSocket.sendMessageToHost(getAndClearInput());
}

function reconnectGame(){
    gameWebSocket.reconnectGame();
}

function leaveGame(){
    gameWebSocket.leaveGame();
}

// *********************** ON EVENT FUNCTIONS *************************

gameWebSocket.onCreateGame = (msg) => {let text = "Game created with ID: " + msg.data; addToChat(text);};
gameWebSocket.onMessageGame = (msg) => { addToChat(msg.playerId + " sent: " + msg.data);};
gameWebSocket.onOtherJoinGame = (msg) => { addToChat(msg.playerId + " joined the game.");};
gameWebSocket.onOtherLeaveGame = (msg) => { addToChat(msg.playerId + " left the game.");};


// ******************* HELPER FUNCTIONS *******************************
function getAndClearInput(){
    var val = input.value;
    input.value = "";
    return val;
}

function addToChat(text)
{
    let entry = document.createElement("LI");
    entry.innerHTML = text;
    output.insertBefore(entry, output.firstChild);
}

