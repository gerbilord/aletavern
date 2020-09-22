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
        switch (this.state.gameState.screen) {
            case "Lobby":
                return (
                    <div className={styles.global}>
                        <Lobby
                            className={styles.text}
                            gameId={this.gameEngine.ws.gameId}
                            players={this.state.gameState.players}
                        />
                    </div>

                );
                break;
            case "RoundOne":
                return (<h1>ROUND ONE</h1>);

            default:
                return (<h1>SOME TING WONG</h1>);
        }
    }

    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ gameState: this.gameEngine.getGameState() }),
            100);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
}
