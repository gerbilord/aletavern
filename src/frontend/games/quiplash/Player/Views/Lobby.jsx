import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../../../../baseComponents/Button'; //TODO make own components for game

// import styles from '../../quiplash.module.css';

export default function Lobby(props) {
    let { numPlayers, startGameFunction, canStart } = props;

    return (
        <div>
            <h1>
                Quiplash
            </h1>
            <h2>
                Waiting for game to start.
            </h2>
            <h3>Players in lobby: {numPlayers}</h3>

            <Button
                buttonText={"Start Game"}
                clickHandler={startGameFunction}
                isDisabled={!canStart}
            />
        </div>
    );
}
