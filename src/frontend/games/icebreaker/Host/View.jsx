// GUI
import React from 'react';
import ReactDOM from 'react-dom';

import Lobby from './Views/Lobby';
import styles from '../icebreaker.module.css';
import Button from '../../../baseComponents/Button';


export default class IcebreakerView extends React.Component {
    constructor(props) {
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;
    }

    // TODO give a real unique key
    render() {
               return (
                    <div className={styles.global}>
                        <Lobby
                            className={styles.text}
                            gameId={this.gameEngine.ws.gameId}
                        />
                    </div>

                );
        }


    componentDidMount() {
    }

    componentWillUnmount() {
    }
}
