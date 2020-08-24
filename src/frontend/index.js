import React from 'react';
import ReactDOM from 'react-dom';
import GameWebSocket from './GameWebSocket';

const Pet = ({name, animal, color}) => {
    return React.createElement("div", {},[
        React.createElement("h1", {}, name),
        React.createElement("h2", {}, animal),
        React.createElement("h2", {}, color)
    ]);
}

const App = () => { return React.createElement( "div", {},
          [
              React.createElement("h1", {}, "Adopt Me!"),
              React.createElement(Pet, {name:"Luna", animal: "Dog", color:"BnW"}),
              React.createElement(Pet, {name:"Pepper", animal: "Plant", color:"Red"}),
              React.createElement(Pet, {name:"Doink", animal: "Cat", color:"Tabby"}),
          ]
        );
      };

ReactDOM.render(React.createElement(App), document.getElementById("root"));
