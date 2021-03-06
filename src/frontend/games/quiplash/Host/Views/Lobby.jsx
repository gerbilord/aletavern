import React from 'react';
import ReactDOM from 'react-dom';

import styles from '../../quiplash.module.css';

export default function Lobby(props) {
    let { gameId, players } = props;

    return (
        <div className={styles.basic_col}>
            <h1>Quiplash</h1>
            <h2>Room Code: {gameId}</h2>
            <br />
            <h3>Playes in game:</h3>
            {players.map((player) => (
                <h4 key={player}>{player} </h4>
            ))}
        </div>
    );
}
