import React, { useState } from 'react';

import 'Icebreaker/icebreaker.css';
import Button from 'Frontend/baseComponents/Button';
import {ReactRoundViewProps} from 'Icebreaker/IbShared/IbRoundComponentLoader';
import gameEngine from './HostAsksTextPromptToAll'

export default function HostAsksTextPromptToAllView(props:ReactRoundViewProps) {
    const {
        ws: { gameId },
        viewData,
    } = props;

    const roundEngine:gameEngine = viewData.getExtraData();


    const [timeLimit, setTimeLimit] = useState("0");
    const [prompt, setPrompt] = useState("");


    return (
        <div className={"basic_col"}>
            <h1>Icebreaker</h1>
            <h2>Room Code: {gameId}</h2>
            <br />
            <h3>Players in game:</h3>
            {roundEngine.players.players.map(({ id, name }) => {
                return (
                    <div key={id}>
                        {name} <br />
                    </div>
                );
            })}


            <div>
                <input
                    type="text"
                    placeholder="Prompt"
                    onChange={(event) => {
                        setPrompt(event.target.value);
                        roundEngine.setPrompt(event.target.value);
                    }}
                    value={prompt}
                />
                <input
                    type="text"
                    placeholder="Time (seconds)"
                    onChange={(event) =>{
                        setTimeLimit(event.target.value);
                        roundEngine.setTimeLimit(event.target.value);
                    }}
                    value={timeLimit}
                />
            </div>
            <div>
                <Button
                    buttonText = "Send prompts"
                    clickHandler = {()=>{roundEngine.sendPrompt()}}
                    passEvent = {false}
                    isDisabled={roundEngine.isRoundActive}
                />
                <Button
                    buttonText = "Force End"
                    clickHandler = {()=>{roundEngine.forceEnd()}}
                    passEvent = {false}
                    isDisabled={!roundEngine.isRoundActive}
                />
            </div>

            { roundEngine.isRoundActive &&
            <div>
                <div>Players yet to answer:</div>
                {roundEngine.playersYetToAnswer.map(player=><div key={player.id}>{player.name}</div>)}
            </div>
            }

            { roundEngine.playerAnswersHistory &&

                roundEngine.playerAnswersHistory.slice().reverse().map(
                    (playerResponseList,index)=> {
                        return <div key={playerResponseList[0].promptData.prompt + index.toString()}>
                            <strong>{playerResponseList[0].promptData.prompt}</strong>
                            {
                                playerResponseList.map(
                                    (playerResponse) => {return <div key={playerResponse.playerId}>
                                        {roundEngine.players.findPlayerFromId(playerResponse.playerId)?.name}: "{playerResponse?.promptData?.answer}"
                                    </div>
                                    }
                                )
                            }
                        </div>
                    })
            }
        </div>
    );
}
