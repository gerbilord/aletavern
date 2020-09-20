// GUI
import React from 'react';
import ReactDOM from 'react-dom';


export default class QuiplashView extends React.Component {
    constructor(props){
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;

        this.state = {gameState:this.gameEngine.getGameState()};
    }

    // TODO give a real unique key
    render(){ return (
        <div>
            <h1>
                Quiplash
            </h1>
            <h2>
                Room Code: {this.gameEngine.ws.gameId}
            </h2>
            <br/>
            <h3>Playes in game:</h3>
            { this.state.gameState.players.map( (player)=>( <h4 key={player}>{player} </h4>) ) }
        </div>
    ) };


    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ gameState: this.gameEngine.getGameState() }),
            1000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
}
