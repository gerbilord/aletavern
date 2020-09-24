// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import Lobby from './Views/Lobby';
import styles from '../quiplash.module.css';
import Wait from './Views/Wait';
import Vote from './Views/Vote';
import Answer from './Views/Answer';


export default class QuiplashView extends React.Component {
    constructor(props) {
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;

        this.state = { gameState: this.gameEngine.getGameState() };
    }

    // TODO give a real unique key
    render() {
        let { screen, stateData } = this.state.gameState;
        var text, buttons;
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

            case "Answer":

                return (
                    <div className={styles.global}>
                        <Answer
                            prompt={stateData.text}
                            sendAnswer={stateData.buttons}
                        />
                    </div>
                );

            case "Vote":
                return (
                    <div className={styles.global}>
                        <Vote
                            prompt={stateData.text}
                            sendAnswer={stateData.buttons}
                        />
                    </div>
                );

            case "Wait":
                return (
                    <div className={styles.global}>
                        <Wait />
                    </div>
                );
            default:
                return (<h1>WRONG</h1>);
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
