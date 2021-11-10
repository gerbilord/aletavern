import React from 'react';

import styles from 'Icebreaker/icebreaker.module.css';

export default function Lobby(props) {
    const {
        ws: { gameId },
        viewData,
    } = props;

    const players = viewData.getExtraData();

    return (
        <div className={styles.basic_col}>
            <h1>Icebreaker</h1>
            <h2>Room Code: {gameId}</h2>
            <br />
            <h3>Players in game:</h3>
            {players.map(({ id, name }) => {
                return (
                    <div key={id}>
                        {name} <br />
                    </div>
                );
            })}
        </div>
    );
}
