import React from 'react';
import ReactDOM from 'react-dom';
import GameWebSocket from './GameWebSocket';
import Pet from "./Pet";

const App = () => { return(
    <div>
        <h1>Cats!</h1>
        <Pet name="Lana" animal="Cat" color="Black and White" />
    </div>
);
                  };

ReactDOM.render(<App />, document.getElementById("root"));
