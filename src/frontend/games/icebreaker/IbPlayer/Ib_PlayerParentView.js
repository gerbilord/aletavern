import React from 'react';

import CONSTANTS from 'Icebreaker/IbConstants';
import 'Icebreaker/icebreaker.css';

// ROUND LOADER
import IbRoundComponentLoader from 'Icebreaker/IbShared/IbRoundComponentLoader';

// ROUND IMPORTS
import LobbyRoundView from './Ib_Rounds/Ib_PlayerLobbyRound/Ib_PlayerLobbyRoundView';
import AnswerPromptRoundView from 'Icebreaker/IbPlayer/Ib_Rounds/Ib_PlayerAnswerPromptRound/Ib_AnswerPromptRoundView';

// SET ROUND TO VIEW MAPPING
const roundViews = [];
roundViews[CONSTANTS.ROUNDS.LOBBY] = LobbyRoundView;
roundViews[CONSTANTS.ROUNDS.PROMPT] = AnswerPromptRoundView;

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
