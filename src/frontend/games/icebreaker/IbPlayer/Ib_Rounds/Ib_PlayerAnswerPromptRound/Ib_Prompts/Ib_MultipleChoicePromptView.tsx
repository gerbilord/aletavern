/*
 * @prettier
 */

import React, { useState } from 'react';
import 'Icebreaker/icebreaker.css';

import Button from 'Frontend/baseComponents/Button'; //TODO make own components for game

import classNames from 'classnames';
import { ReactRoundViewProps } from 'Icebreaker/IbShared/IbRoundComponentLoader';
import { PlayerPromptExtraViewData } from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_AnswerPromptEngine';
import MultipleChoicePrompt from 'Icebreaker/IbHost/Rounds/HostAsksMultipleChoicePromptToAllRound/MultipleChoicePrompt';

export default function IbTextPromptView(props: ReactRoundViewProps) {
    const { viewData } = props;

    const {
        promptData,
        answerSent,
        updateAnswer,
        sendAnswer,
    }: PlayerPromptExtraViewData<MultipleChoicePrompt> = viewData?.getExtraData();

    const [selectedChoice, setSelectedChoice] = useState('');
    const choices = Array.from(promptData.choices);
    const promptText = promptData.prompt;

    const handleSendMessage = () => {
        if (selectedChoice.length > 0) {
            sendAnswer();
            setSelectedChoice('');
        }
    };

    const onChangeHandler = (newChoice) => {
        setSelectedChoice(newChoice);
        updateAnswer(newChoice);
    };

    if (answerSent) {
        return <h2>Waiting for other players to finish.</h2>;
    }

    return (
        <div className="basic_col">
            <h2>{promptText}</h2>

            {choices.map((choice, index) => (
                <button
                    key={choice}
                    className={classNames(
                        'ib-multiple-choice-choice',
                        'ib-button',
                        {
                            'ib-selected-choice': choice === selectedChoice,
                            'ib-unselected-choice': choice !== selectedChoice,
                        }
                    )}
                    onClick={() => {
                        onChangeHandler(choice);
                    }}
                >
                    {choice}
                </button>
            ))}

            <Button
                buttonText="Send"
                clickHandler={handleSendMessage}
                isDisabled={selectedChoice.length === 0}
            />
        </div>
    );
}
