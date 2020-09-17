// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import QuiplashView from './games/quiplash/quiplashView';
import Home from './home.jsx';

// LOGIC
import GameWebSocket from './GameWebSocket';

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = { game:"home"};
    }

    render() {

        switch(this.state.game) {
            case "home":
                return( <Home /> );
                break;
            case "quiplash":
                return( <QuiplashView /> );
                break;
            default:
                return(<h1>"Broken"</h1>)
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

