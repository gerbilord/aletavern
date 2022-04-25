/*
 * @prettier
 */

import 'Icebreaker/icebreaker.css';
import React, { useState } from 'react';

import Button from 'Frontend/baseComponents/Button';
import { PlayerPromptExtraViewData } from '../Ib_AnswerPromptEngine';
import TextPrompt from 'Icebreaker/IbHost/Rounds/HostAsksTextPromptToAllRound/TextPrompt';
import { ReactRoundViewProps } from 'Icebreaker/IbShared/IbRoundComponentLoader';

export default function Ib_TextPromptView(props: ReactRoundViewProps) {
    const { viewData } = props;

    const {
        promptData,
        answerSent,
        updateAnswer,
        sendAnswer,
    }: PlayerPromptExtraViewData<TextPrompt> = viewData?.getExtraData();

    const [userInput, updateUserInput] = useState('');

    // TODO don't allow whitespace only.
    // TODO add character limit.
    const handleSendMessage = () => {
        if (userInput.length > 0) {
            sendAnswer();
        }
    };

    const onChangeHandler = (e) => {
        updateUserInput(e.target.value);
        updateAnswer(e.target.value);
    };

    if (answerSent) {
        return <h2>Waiting for other players to finish.</h2>;
    }

    return (
        <div className={'basic_col'}>
            <h2>{promptData.prompt}</h2>
            <input type="text" value={userInput} onChange={onChangeHandler} />
            <Button
                buttonText="Send"
                clickHandler={handleSendMessage}
                isDisabled={userInput.length === 0}
            />
        </div>
    );
}
