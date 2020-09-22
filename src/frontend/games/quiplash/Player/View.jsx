// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import Lobby from './Views/Lobby';


export default class QuiplashView extends React.Component {
    constructor(props) {
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;

        this.state = { gameState: this.gameEngine.getGameState() };
    }

    // TODO give a real unique key
    render() {
        let { screen, stateData } = this.state.gameState;
        switch (this.state.gameState.screen) {

            case "Lobby":
                return (
                    <Lobby
                        numPlayers={stateData.numPlayers}
                        startGameFunction={stateData.startGameFunction}
                        canStart={stateData.canStart}
                    />
                );
                break;
            case "RoundOne":
                return (<h1>ROUND ONE</h1>);
        }
    };


    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ gameState: this.gameEngine.getGameState() }),
            100);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
}
