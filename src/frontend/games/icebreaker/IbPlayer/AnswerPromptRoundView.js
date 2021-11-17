import React from 'react';

import CONSTANTS from 'Icebreaker/IbConstants';
import styles from '../icebreaker.module.css';

// ROUND LOADER
import IbRoundComponentLoader from 'Icebreaker/IbShared/IbRoundComponentLoader';

// PROMPT IMPORTS
import TextRoundView from 'Icebreaker/IbPlayer/IbTextPromptView';
import RankRoundView from 'Icebreaker/IbPlayer/IbRankPromptView';
import MultipleChoiceRoundView from 'Icebreaker/IbPlayer/IbMultipleChoicePromptView'
import MatchingPromptView from 'Icebreaker/IbPlayer/IbMatchingPromptView';

// SET ROUND TO VIEW MAPPING
const promptViews = [];
promptViews[CONSTANTS.PROMPT_TYPE.TEXT] = TextRoundView;
promptViews[CONSTANTS.PROMPT_TYPE.RANK] = RankRoundView;
promptViews[CONSTANTS.PROMPT_TYPE.MULTIPLE_CHOICE] = MultipleChoiceRoundView;
promptViews[CONSTANTS.PROMPT_TYPE.MATCHING] = MatchingPromptView;

export default (props) => {
        const { viewLevel, viewData, ws} = props;

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
