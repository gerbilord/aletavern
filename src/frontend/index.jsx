// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import Button from "./baseComponents/Button";

import './home.css';

// LOGIC
import GameWebSocket from './GameWebSocket';


const App = () => { return(
    <div>
      <div className="button_list">
        <h1>Ale Tavern</h1>
        <input type="text" placeholder="Game Id" />
        <input type="text" placeholder="Name" />
        <Button buttonText="Join" />
        <h3>or</h3>
        <Button buttonText="Create" />
      </div>
    </div>
);
                  };

/*
  Add functions + event listeners here

  Listener: Game over -> remove any component, put back home page

  Function: When join/create game, replace home component with game componenet and kick off the code.

  */

ReactDOM.render(<App />, document.getElementById("root"));
