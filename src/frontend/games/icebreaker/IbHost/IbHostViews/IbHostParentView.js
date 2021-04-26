import React from 'react';

import CONSTANTS from 'Icebreaker/IbConstants';
import styles from '../../icebreaker.module.css';

// ROUND LOADER
import IbRoundComponentLoader from 'Icebreaker/IbShared/IbSharedViews/IbRoundComponentLoader';

// ROUND IMPORTS
import LobbyRoundView from './IbHostRoundViews/IbHostLobbyRoundView';
import AskPlayerQuestionRound from 'Icebreaker/IbHost/IbHostViews/IbHostRoundViews/IbHostSubRoundViews/IbHostAskPlayerQuestionRoundView';

// SET ROUND TO VIEW MAPPING
const roundViews = [];
roundViews[CONSTANTS.ROUNDS.LOBBY] = LobbyRoundView;
roundViews[CONSTANTS.ROUNDS.ASK_PLAYERS_QUESTION] = AskPlayerQuestionRound;

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
            <div className={styles.global}>
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
