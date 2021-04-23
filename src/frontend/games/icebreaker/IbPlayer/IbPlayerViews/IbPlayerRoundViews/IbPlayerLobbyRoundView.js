import React from 'react';
import Button from 'Frontend/baseComponents/Button'; //TODO make own components for game

import styles from 'Icebreaker/icebreaker.module.css';

export default function Lobby(props) {
    const {
        ws,
        viewTypes,
        extraData: { startRoundFunction, canStartRound },
    } = props;

    return (
        <div className={styles.basic_col}>
            <h1>Icebreaker</h1>
            <h2>Waiting for game to start.</h2>

            <Button
                buttonText="Start Game"
                clickHandler={startRoundFunction}
                isDisabled={!canStartRound}
            />
        </div>
    );
}
