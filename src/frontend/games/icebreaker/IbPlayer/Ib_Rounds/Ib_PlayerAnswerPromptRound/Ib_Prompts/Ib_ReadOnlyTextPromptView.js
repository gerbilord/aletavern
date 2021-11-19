/*
 * @prettier
 */

import React, { useState } from 'react';

import styles from 'Icebreaker/icebreaker.module.css';

export default function Ib_ReadOnlyTextPromptView(props) {
    const { viewData } = props;

    const {
        promptData,
        answerSent,
        updateAnswer,
        sendAnswer,
    } = viewData?.getExtraData();

    return (
        <div className={styles.basic_col}>
            <h2>{promptData.prompt}</h2>
        </div>
    );
}
