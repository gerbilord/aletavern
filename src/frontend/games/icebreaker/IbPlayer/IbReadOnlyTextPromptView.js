/*
 * @prettier
 */

import React, { useState } from 'react';
import Button from 'Frontend/baseComponents/Button'; //TODO make own components for game

import styles from 'Icebreaker/icebreaker.module.css';

export default function IbReadOnlyTextPromptView(props) {
    const { viewData } = props;

    const {
        prompt,
        answerSent,
        updateAnswer,
        sendAnswer,
    } = viewData?.getExtraData();

    return (
        <div className={styles.basic_col}>
            <h2>{prompt}</h2>
        </div>
    );
}
