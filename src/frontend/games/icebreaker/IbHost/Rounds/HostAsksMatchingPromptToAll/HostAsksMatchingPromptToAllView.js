import React, { useState } from 'react';

import styles from 'Icebreaker/icebreaker.module.css';
import Button from 'Frontend/baseComponents/Button';

export default function HostAsksMatchingPromptToAllView(props) {
    const {
        ws: { gameId },
        viewData,
    } = props;

    const roundEngine = viewData.getExtraData();

    const [timeLimit, setTimeLimit] = useState("0");
    const [prompt, setPrompt] = useState("");
    const [matchable, setMatchable] = useState("");
    const [category, setCategory] = useState("");


    return (
        <div className={styles.basic_col}>
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
                        roundEngine.setMainPrompt(event.target.value);
                    }}
                    value={prompt}
                />
                <input
                    type="text"
                    placeholder="Matchable"
                    onChange={(event) => {
                        setMatchable(event.target.value);
                    }}
                    value={matchable}
                />
                <input
                    type="text"
                    placeholder="Category"
                    onChange={(event) => {
                        setCategory(event.target.value);
                    }}
                    value={category}
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
                    buttonText = "Add matchable"
                    clickHandler = {()=>{
                        roundEngine.addMatchable(matchable);
                        setMatchable("");
                    }}
                    passEvent = {false}
                    isDisabled={roundEngine.isRoundActive}
                />
                <Button
                    buttonText = "Add Category"
                    clickHandler = {()=>{
                        roundEngine.addCategory(category);
                        setCategory("");
                    }}
                    passEvent = {false}
                    isDisabled={roundEngine.isRoundActive}
                />
                <Button
                    buttonText = "Clear Matchables and Categories"
                    clickHandler = {()=>{
                        roundEngine.resetPromptData();
                    }}
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

            <div>
                <strong>Current Matchables:</strong>
                <div>
                    {
                        roundEngine.prompt.matchables.map(match=>{
                            return <div key={match}>{match}</div>
                        })
                    }
                </div>
                <strong>Current Categories:</strong>
                <div>
                    {
                        roundEngine.prompt.categories.map(categ=>{
                            return <div key={categ}>{categ}</div>
                        })
                    }
                </div>
            </div>
            { roundEngine.isRoundActive &&
            <div>
                <div>Players yet to answer:</div>
                {roundEngine.playersYetToAnswer.map(player=><div key={player.id}>{player.name}</div>)}
            </div>
            }

            { roundEngine.playerAnswersHistory &&

            roundEngine.playerAnswersHistory.slice().reverse().map(
                (answerList, index)=> {
                    return <div key={answerList[0]?.playerResponse.prompt?.mainPrompt + index}>
                        <strong>{answerList[0]?.playerResponse?.prompt?.mainPrompt}</strong>
                        {
                            answerList.map(
                                (answer) => {return <div key={answer.playerId}>
                                    {roundEngine.players.findPlayerFromId(answer.playerId).name}: "{answer?.playerResponse?.prompt.categories.map(
                                    (category)=>{return <span key={category}>{category}:{answer?.playerResponse?.answer[category]},</span>}
                                )}"
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
