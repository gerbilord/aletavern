/*
 * @prettier
 */

import React from 'react';
import 'Icebreaker/icebreaker.css';

export default function AnswerRoundView(props) {
    const { viewData } = props;

    const { playersYetToAnswer, timeLeft } = viewData.getExtraData();

    const secondsLeft = ~~(timeLeft / 1000); // Convert time from ms to seconds.

    return (
        <div className={'basic_col'}>
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
