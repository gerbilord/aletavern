import React from 'react';
import GameCanvas from "Games/actNormal/anHost/anH_GameCanvas";

import gameEngine from './anH_Engine';
import anH_ViewData from "./anH_ViewData";


export default class anH_View extends React.Component {
    private gameEngine: gameEngine;


    constructor(props) {
        super(props);

        this.gameEngine = props.gameWrapper.gameEngine;
        this.state = { viewData: this.gameEngine.getViewData() };
    }

    render() {
        // @ts-ignore
        const { viewData }:{viewData:anH_ViewData} = this.state;

return (
            <div className={"actNormal"}>
                Host View
                <div>
                    Game Id: {this.gameEngine.ws.gameId}
                </div>
                <div>
                    <GameCanvas gameEngine = {this.gameEngine}/>
                </div>
            </div>
        );
    }
}
