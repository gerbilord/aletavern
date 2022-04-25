import React from 'react';

import CONSTANTS from 'Icebreaker/IbConstants';

// ROUND LOADER
import IbRoundComponentLoader, { ReactRoundViewProps } from 'Icebreaker/IbShared/IbRoundComponentLoader';

// PROMPT IMPORTS
import TextRoundView from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_Prompts/Ib_TextPromptView';
import RankRoundView from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_Prompts/Ib_RankPromptView';
import MultipleChoiceRoundView from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_Prompts/Ib_MultipleChoicePromptView'
import MatchingPromptView from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_Prompts/Ib_MatchingPromptView';
import ReadOnlyTextPromptView from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_Prompts/Ib_ReadOnlyTextPromptView';

// SET ROUND TO VIEW MAPPING
const promptViews = [];
promptViews[CONSTANTS.PROMPT_TYPE.TEXT] = TextRoundView;
promptViews[CONSTANTS.PROMPT_TYPE.RANK] = RankRoundView;
promptViews[CONSTANTS.PROMPT_TYPE.MULTIPLE_CHOICE] = MultipleChoiceRoundView;
promptViews[CONSTANTS.PROMPT_TYPE.MATCHING] = MatchingPromptView;
promptViews[CONSTANTS.PROMPT_TYPE.READ_ONLY_TEXT] = ReadOnlyTextPromptView;

export default (props) => {
        const { viewLevel, viewData, ws}: ReactRoundViewProps = props;

        return (
            <div>
                <IbRoundComponentLoader
                    viewLevel={viewLevel + 1}
                    roundViews={promptViews}
                    viewData={viewData}
                    ws={ws}
                />
            </div>
        );
};
