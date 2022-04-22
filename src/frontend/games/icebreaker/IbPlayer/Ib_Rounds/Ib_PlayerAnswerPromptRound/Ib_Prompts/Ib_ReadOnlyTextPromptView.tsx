/*
 * @prettier
 */

import 'Icebreaker/icebreaker.css';
import React from 'react';

export default function Ib_ReadOnlyTextPromptView(props: { viewData: any }) {
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
