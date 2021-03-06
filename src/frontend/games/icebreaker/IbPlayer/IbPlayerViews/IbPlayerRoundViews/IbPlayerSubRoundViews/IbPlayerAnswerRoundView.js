/*
 * @prettier
 */

import React, { useState } from 'react';
import Button from 'Frontend/baseComponents/Button'; //TODO make own components for game

import styles from 'Icebreaker/icebreaker.module.css';

export default function AnswerRoundView(props) {
    const {
        extraData: { prompt, answerSent, updateAnswer, sendAnswer },
    } = props;

    const [userInput, updateUserInput] = useState('');

    // TODO don't allow whitespace only.
    // TODO add character limit.
    const handleSendMessage = () => {
        if (userInput.length > 0) {
            sendAnswer(userInput);
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
        <div className={styles.basic_col}>
            <h2>{prompt}</h2>
            <input type="text" value={userInput} onChange={onChangeHandler} />
            <Button
                buttonText="Send"
                clickHandler={handleSendMessage}
                isDisabled={userInput.length === 0}
            />
        </div>
    );
}
