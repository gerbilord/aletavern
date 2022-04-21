/*
 * @prettier
 */

import React, { useState } from 'react';

import 'Icebreaker/icebreaker.css';

export default function Ib_ReadOnlyTextPromptView(props) {
    const { viewData } = props;

    const {
        promptData,
        answerSent,
        updateAnswer,
        sendAnswer,
    } = viewData?.getExtraData();

    return (
        <div className={'basic_col'}>
            <h2>{promptData.prompt}</h2>
        </div>
    );
}