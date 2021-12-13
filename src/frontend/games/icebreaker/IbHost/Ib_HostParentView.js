import React from 'react';

import CONSTANTS from 'Icebreaker/IbConstants';
import '../icebreaker.css';

// ROUND LOADER
import IbRoundComponentLoader from 'Icebreaker/IbShared/IbRoundComponentLoader';

// ROUND IMPORTS
import LobbyRoundView from 'Icebreaker/IbHost/Rounds/LobbyRound/IbHostLobbyRoundView';
import HostAsksTextPromptToAllView from 'Icebreaker/IbHost/Rounds/HostAsksTextPromptToAllRound/HostAsksTextPromptToAllView';
import HostAsksRankPromptToAllView from 'Icebreaker/IbHost/Rounds/HostAsksRankPromptToAllRound/HostAsksRankPromptToAllView';
import HostAsksMultipleChoicePromptToAllView
    from 'Icebreaker/IbHost/Rounds/HostAsksMultipleChoicePromptToAllRound/HostAsksMultipleChoicePromptToAllView';
import HostAsksMatchingPromptToAllView
    from 'Icebreaker/IbHost/Rounds/HostAsksMatchingPromptToAll/HostAsksMatchingPromptToAllView';
import HostSendsReadOnlyTextToAllView
    from 'Icebreaker/IbHost/Rounds/HostSendsReadOnlyTextToAllRound/HostSendsReadOnlyTextToAllView';
import NeverHaveIEverGameView from 'Icebreaker/IbHost/Rounds/NeverHaveIEverGame/NeverHaveIEverGameView';


// SET ROUND TO VIEW MAPPING
const roundViews = [];
roundViews[CONSTANTS.ROUNDS.LOBBY] = LobbyRoundView;
roundViews[CONSTANTS.ROUNDS.HOST_ASKS_TEXT_PROMPT_TO_ALL] = HostAsksTextPromptToAllView;
roundViews[CONSTANTS.ROUNDS.HOST_ASKS_RANK_PROMPT_TO_ALL] = HostAsksRankPromptToAllView;
roundViews[CONSTANTS.ROUNDS.HOST_ASKS_MULTIPLE_CHOICE_PROMPT_TO_ALL] = HostAsksMultipleChoicePromptToAllView;
roundViews[CONSTANTS.ROUNDS.HOST_ASKS_MATCHING_PROMPT_TO_ALL] = HostAsksMatchingPromptToAllView;
roundViews[CONSTANTS.ROUNDS.HOST_SENDS_READ_ONLY_TEXT_TO_ALL] = HostSendsReadOnlyTextToAllView;
roundViews[CONSTANTS.ROUNDS.HOST_NEVER_HAVE_I_EVER_GAME] = NeverHaveIEverGameView;


export default class IcebreakerView extends React.Component {
    constructor(props) {
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;
        this.state = { viewData: this.gameEngine.getViewData() };
    }

    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ viewData: this.gameEngine.getViewData() }),
            100
        );
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { viewData } = this.state;

        return (
            <div className={"icebreaker"}>
                <IbRoundComponentLoader
                    viewLevel={0}
                    roundViews={roundViews}
                    viewData={viewData}
                    ws={this.gameEngine.ws}
                />
            </div>
        );
    }
}
