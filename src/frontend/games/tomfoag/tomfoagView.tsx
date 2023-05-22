/*
 * @prettier
 */

import React from 'react';
import BoardBuilder from 'Games/tomfoag/tomfoagViewComponents/BoardBuilder';
import TomfoagEngine, {BoardState, IMoveType} from "Games/tomfoag/tomfoagEngine";
import TomfoagWrapper from "Games/tomfoag/tomfoagWrapper";
import TakePlaceActionBar from "Tomfoag/tomfoagViewComponents/TakePlaceActionBar";

type IProps = { gameWrapper: TomfoagWrapper, gameEngine: TomfoagEngine };
type IState = { viewData: BoardState, selectedAction: IMoveType, selectedDirection: [number, number] };


export default class TomfoagView extends React.Component<IProps, IState> {
    private interval: number;
    private gameEngine: TomfoagEngine;

    constructor(props: IProps) {
        super(props);

        this.gameEngine = props.gameWrapper.gameEngine;
        this.state = { viewData: this.gameEngine.getBoardState(), selectedAction: "take", selectedDirection: [0,0] };
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

    selectTake() {
        if(!this.state.viewData.canMove){
            this.setState({selectedAction: "take"});
        }
    }

    canPlace(){
        return !this.state.viewData.canMove && this.state.viewData.players[this.state.viewData.turn][2] > 0;
    }

    selectPlace() {
        if(this.canPlace()){
            this.setState({selectedAction: "place"});
        }
    }

    playMove(hex:[number, number]){
        let player = this.state.viewData.players[this.state.viewData.turn];
        let response = this.gameEngine.playMove(player, this.state.selectedAction, [hex[0], hex[1]]);
        console.log(response[1]);
        if(!response[0]){
            return;
        }

        if(this.gameEngine.getBoardState().canMove){
            this.setState({selectedAction: "move"});
        } else {
            this.setState({selectedAction: "take"});
        }
    }

    render() {
        const {
            board,
            glacier,
            players,
            validMoves,
            turn,
            canMove,
            winner
        } = this.state.viewData;

        return (
            <div className={'tomfoag'}>
                <div>
                    {turn === 0 ? "Red's " : "Blue's "} turn
                    <br/>
                    {canMove ? "Moving" : "Taking/Placing"}
                    <br/>
                    Currently: {this.state.selectedAction}
                    <br/>
                    <br/>
                    Red's Ice: {this.state.viewData.players[0][2]}
                    <br/>
                    Blue's Ice: {this.state.viewData.players[1][2]}
                    <br/>
                    {winner === 0 && <div className={'bigText'}>Red wins!</div>}
                    {winner === 1 && <div className={'bigText'}>Blue wins!</div>}
                </div>
                <BoardBuilder
                    viewData={this.state.viewData}
                    gameEngine={this.gameEngine}
                    playMove={this.playMove.bind(this)}
                />
                <TakePlaceActionBar
                    selectPlace={this.selectPlace.bind(this)}
                    selectTake={this.selectTake.bind(this)}
                    selectedAction={this.state.selectedAction}
                    canPlace={this.canPlace()}
                />
            </div>
        );
    }
}
