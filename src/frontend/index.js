// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import Home from './home/home';

// LOGIC
import GameWebSocket from './GameWebSocket';

// GAME IMPORTS
import Quiplash from './games/quiplash/quiplashWrapper';
import Santorini from './games/santorini/santoriniWrapper';
import Icebreaker from 'Icebreaker/icebreakerWrapper.js';
import Tomfoag from './games/tomfoag/tomfoagWrapper';

// Variables
const ws = new GameWebSocket(true);
const games = [];

// GAME VARIABLE SETUP
games['Quiplash'] = { game: Quiplash };
games['Santorini'] = { game: Santorini };
games['Icebreaker'] = { game: Icebreaker };
games['Tomfoag'] = { game: Tomfoag };


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentGame: 'home' };

        this.loadCreateGame = this.loadCreateGame.bind(this);
        this.loadJoinGame = this.loadJoinGame.bind(this);
        this.loadReconnectGame = this.loadReconnectGame.bind(this);
        this.currentGame = undefined;
    }

    loadCreateGame(serverResponse) {
        console.log('Create success');
        let otherArgs = { connectionType: 'create' };

        this.currentGame = new games[serverResponse.data.gameType].game(
            ws,
            otherArgs
        ); // TODO consider refactoring how this works (E.g game wrapper etc)

        this.setState({ currentGame: serverResponse.data.gameType }); // TODO handle failure to connect
    }

    loadJoinGame(serverResponse) {
        console.log('Join success');
        let otherArgs = { connectionType: 'join' };

        this.currentGame = new games[serverResponse.data.gameType].game(
            ws,
            otherArgs
        ); // TODO consider refactoring how this works (E.g game wrapper etc)
        //TODO consider adding object to be passed in

        this.setState({ currentGame: serverResponse.data.gameType }); // TODO handle failure to connect
    }

    loadReconnectGame(serverResponse) {
        if (serverResponse.status === 'SUCCESS') {
            console.log('Reconnect success');

            let otherArgs = { connectionType: 'reconnect' };

            this.currentGame = new games[serverResponse.data.gameType].game(
                ws,
                otherArgs
            ); // TODO consider refactoring how this works (E.g game wrapper etc)
            //TODO consider adding object to be passed in

            this.setState({ currentGame: serverResponse.data.gameType }); // TODO handle failure to connect
        } else {
            console.log('Reconnect failed.');
            this.forceUpdate();
        }
    }

    render() {
        switch (
            this.state.currentGame //TODO consider making if instead
        ) {
            case 'home':
                return (
                    <Home
                        games={games}
                        clickCreate={(obj) => {
                            ws.createGame(obj.gameType, obj.name).then(
                                (serverResponse) => {
                                    this.loadCreateGame(serverResponse);
                                }
                            );
                        }}
                        clickJoin={(gameCode, playerName) => {
                            ws.joinGame(gameCode, playerName).then(
                                (serverResponse) => {
                                    this.loadJoinGame(serverResponse);
                                }
                            );
                        }}
                        clickReconnect={() => {
                            ws.reconnectGame().then((serverResponse) => {
                                this.loadReconnectGame(serverResponse);
                            });
                        }}
                    />
                );
                break;

            default:
                let GameView = this.currentGame.getGlobalGameView();
                return <GameView gameWrapper={this.currentGame} />; // TODO seperate host and join view
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

ReactDOM.render(<App />, document.getElementById('root'));
