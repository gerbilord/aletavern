import React from 'react';
import JoystickCircle from "Games/actNormal/anHost/joystickCircle";


import gameEngine from './anhEngine';
import anhViewData from "./anhViewData";
import Canvas from "Games/actNormal/anHost/anhCanvas";

export default class anhView extends React.Component {
    private gameEngine: gameEngine;


    constructor(props) {
        super(props);

        this.gameEngine = props.gameWrapper.gameEngine;
        this.state = { viewData: this.gameEngine.getViewData() };
    }

    render() {
        // @ts-ignore
        const { viewData }:{viewData:anhViewData} = this.state;

return (
            <div className={"actNormal"}>
                Host View
                <div>
                    Game Id: {this.gameEngine.ws.gameId}
                </div>
                <div>
                    <JoystickCircle gameEngine = {this.gameEngine}/>
                </div>
            </div>
        );
    }
}
