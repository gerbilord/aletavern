import React, { useState } from 'react';

import 'Icebreaker/icebreaker.css';
import { ReactRoundViewProps } from 'Icebreaker/IbShared/IbRoundComponentLoader';
import gameEngine from './NeverHaveIEverGame';

export default function NeverHaveIEverGameView(props) {
    const {
        ws: { gameId },
        viewData,
    }: ReactRoundViewProps = props;

    const roundEngine: gameEngine = viewData.getExtraData();

    return (
        <div className={"basic_col"}>
            <h1>Icebreaker</h1>
            <h2>Room Code: {gameId}</h2>
            <br />
            <h3>Players in game:</h3>
            {roundEngine.playersData.players.map(({ id, name }) => {
                return (
                    <div key={id}>
                        {name} <br />
                    </div>
                );
            })}
        </div>);
}
