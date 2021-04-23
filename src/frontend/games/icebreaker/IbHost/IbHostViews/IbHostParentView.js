import React from 'react';

import Lobby from './IbHostRoundViews/IbHostLobbyRoundView';
import CONSTANTS from 'Icebreaker/IbConstants';
import styles from '../../icebreaker.module.css';

export default class IcebreakerView extends React.Component {
    constructor(props) {
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;
        this.state = { viewData: this.gameEngine.getViewData() };
    }

    render() {
        const { viewData } = this.state;

        const viewTypes = viewData?.getViewTypes();
        const extraData = viewData?.getExtraData();

        if (viewTypes?.length > 0) {
            switch (
                viewTypes[0] // TODO Refactor to getter method instead of switch.
            ) {
                case CONSTANTS.ROUNDS.LOBBY:
                    return (
                        <div className={styles.global}>
                            <Lobby
                                ws={this.gameEngine.ws}
                                viewTypes={viewTypes}
                                extraData={extraData}
                            />
                        </div>
                    );
            }
        }

        return (
            <div className={styles.global}>
                <h1>Icebreaker Game</h1>
                <h2>No view data D;</h2>
            </div>
        );
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
}
