/*
 * @prettier
 */

import React from 'react';
import BoardBuilder from 'Games/tomfoag/tomfoagViewComponents/BoardBuilder';

export default class TomfoagView extends React.Component {
    constructor(props) {
        super(props);

        this.gameEngine = this.props.gameWrapper.gameEngine;
        this.state = { viewData: this.gameEngine.getBoardState() };
    }

    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ viewData: this.gameEngine.getBoardState() }),
            500
        );
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const {
            board,
            glacier,
            players,
            validMoves,
            turn,
        } = this.state.viewData;

        return (
            <BoardBuilder
                viewData={this.state.viewData}
                gameEngine={this.gameEngine}
            />
        );
    }
}
