// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import Lobby from './Views/Lobby';
import styles from '../quiplash.module.css';


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
                    <div className={styles.global}>
                        <Lobby
                            numPlayers={stateData.numPlayers}
                            startGameFunction={stateData.startGameFunction}
                            canStart={stateData.canStart}
                        />
                    </div>
                );
                break;
            case "Text Round":
                return (<h1>Round {stateData.roundNum}</h1>);
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
