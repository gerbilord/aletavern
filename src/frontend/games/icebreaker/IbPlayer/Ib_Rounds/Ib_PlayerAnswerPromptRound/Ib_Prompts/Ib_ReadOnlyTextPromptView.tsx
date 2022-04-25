/*
 * @prettier
 */

import 'Icebreaker/icebreaker.css';
import React from 'react';
import { ReactRoundViewProps } from 'Icebreaker/IbShared/IbRoundComponentLoader';
import { PlayerPromptExtraViewData } from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_AnswerPromptEngine';
import ReadOnlyTextPrompt from 'Icebreaker/IbHost/Rounds/HostSendsReadOnlyTextToAllRound/ReadOnlyTextPrompt';

export default function Ib_ReadOnlyTextPromptView(props: ReactRoundViewProps) {
    const { viewData } = props;

    const {
        promptData,
        answerSent,
        updateAnswer,
        sendAnswer,
    }: PlayerPromptExtraViewData<ReadOnlyTextPrompt> = viewData?.getExtraData();

    return (
        <div className={'basic_col'}>
            <h2>{promptData.prompt}</h2>
        </div>
    );
}
