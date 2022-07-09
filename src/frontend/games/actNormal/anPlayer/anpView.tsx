import React from 'react';

import gameEngine from './anpEngine';
import anpViewData from "./anpViewData";
import TouchableButton from "Games/actNormal/anPlayer/touchableButton";
import {Joystick} from "react-joystick-component";

import "Games/actNormal/an.css";

export default class anpView extends React.Component {
    private intervalId: number;
    private gameEngine: gameEngine;

    constructor(props) {
        super(props);

        this.gameEngine = props.gameWrapper.gameEngine;
        this.state = { viewData: this.gameEngine.getViewData() };
    }

    componentDidMount() {
        this.intervalId = setInterval(
            () => this.setState({ viewData: this.gameEngine.getViewData() }),
            100
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {

        // @ts-ignore
        const { viewData }:{viewData:anpViewData} = this.state;

        const onMove = (data) =>{
            this.gameEngine.ws.sendMessageToHost(data)
        }

        // @ts-ignore
        return (
            <div className={"actNormal"}>
                <div className={"flexRow"}>
                    <Joystick throttle={50} size={200} sticky={false} baseColor="gray" stickColor="black" move={onMove} stop={onMove}/>
                    <TouchableButton gameEngine={this.gameEngine}/>
                </div>
            </div>
        );
    }
}
