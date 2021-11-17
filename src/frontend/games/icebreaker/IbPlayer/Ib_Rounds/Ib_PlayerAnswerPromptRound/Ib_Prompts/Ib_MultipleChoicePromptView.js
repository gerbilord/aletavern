/*
 * @prettier
 */

import React, { useState } from 'react';
import Button from 'Frontend/baseComponents/Button'; //TODO make own components for game

import styles from 'Icebreaker/icebreaker.css';
import classNames from 'classnames';

export default function IbTextPromptView(props) {
    const { viewData } = props;

    const {
        prompt,
        answerSent,
        updateAnswer,
        sendAnswer,
    } = viewData?.getExtraData();

    const [selectedChoice, setSelectedChoice] = useState('');
    const choices = Array.from(prompt.choices);
    const promptText = prompt.prompt;

    const handleSendMessage = () => {
        if (selectedChoice.length > 0) {
            sendAnswer();
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
        <div className={styles.basic_col}>
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
