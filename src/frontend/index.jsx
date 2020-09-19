// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import Quiplash from './games/quiplash/quiplashWrapper';
import Home from './home.jsx';

// LOGIC
import GameWebSocket from './GameWebSocket';


// Variables
var ws = new GameWebSocket(true);
var games = [];


games['Quiplash'] = {game:Quiplash};
games['Santorini'] = {game:undefined};



class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentGame: "home" };

        this.loadCreateGame = this.loadCreateGame.bind(this);
        this.loadJoinGame = this.loadJoinGame.bind(this);
    }

    loadCreateGame(serverResponse) { // TODO seperate host and join view
        console.log(serverResponse);
        console.log("Create success");

        this.setState({currentGame:serverResponse.data.gameType}); // TODO handle failure to connect
    }

    loadJoinGame(serverResponse) { // TODO seperate host and join view
        console.log(serverResponse);
        console.log("Join success");

        this.setState({currentGame:serverResponse.data.gameType});  // TODO handle failure to connect
    }

    render() {
        switch (this.state.currentGame) { //TODO consider making if instead
            case "home":
                return (<Home
                            games = {games}
                            clickCreate={(gameType) => { ws.createGame(gameType).then((serverResponse) => { this.loadCreateGame(serverResponse) }); }}
                            clickJoin={(gameCode) => { ws.joinGame(gameCode).then((serverResponse) => { this.loadJoinGame(serverResponse)}); }}
                />);
                break;

            default:
                const game = new games[this.state.currentGame].game; // TODO consider refactoring how this works (E.g game wrapper etc)
                const GameView = game.gameView; // TODO seperate host and join view
                return (<game.gameView gameWrapper={game}/>);
        }
    }
}


/*
   Add functions + event listeners here

   Listener: Game over -> remove any component, put back home page

   Function: When join/create game, replace home component with game componenet and kick off the code.

 ******************************************************************



// ** Game view is rendered. {props}
// ** Loop, every tick query the game object.


// ** game object created.
// ** game object has Get game view:

// ** Timer screen, little people ready?



class gameRouter {

    constructor()
    {
        this.currentGame = "home";
    }


    startGame(gameName) {

        switch(gameName){

            case 'home':
                break;

            default:
        }

    }

    endGameHandler() {_

        return;
    }
}
*/



ReactDOM.render(<App />, document.getElementById("root"));

