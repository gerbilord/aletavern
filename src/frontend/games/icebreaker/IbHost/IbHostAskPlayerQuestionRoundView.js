/*
 * @prettier
 */

import React from 'react';
import styles from 'Icebreaker/icebreaker.module.css';

export default function AnswerRoundView(props) {
    const { viewData } = props;

    const { playersYetToAnswer, timeLeft } = viewData.getExtraData();

    const secondsLeft = ~~(timeLeft / 1000); // Convert time from ms to seconds.

    return (
        <div className={styles.basic_col}>
            <h1>Waiting for players to answer.</h1>
            <h2>Time left: {secondsLeft}</h2>
            <h3>Players left to answer:</h3>
            <div>
                {playersYetToAnswer.map(({ id, name }) => {
                    return <div key={id}>{name}</div>;
                })}
            </div>
        </div>
    );
}
