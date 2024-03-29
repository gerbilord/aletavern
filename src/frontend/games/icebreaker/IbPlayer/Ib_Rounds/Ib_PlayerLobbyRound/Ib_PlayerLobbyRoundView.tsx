import React from 'react';
import Button from 'Frontend/baseComponents/Button'; //TODO make own components for game

import 'Icebreaker/icebreaker.css';
import { ReactRoundViewProps } from 'Icebreaker/IbShared/IbRoundComponentLoader';

export default function Lobby(props:ReactRoundViewProps) {
    const {
        ws,
        viewData,
    } = props;

    const { startRoundFunction, canStartRound } = viewData?.getExtraData();

    return (
        <div className={"basic_col"}>
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
