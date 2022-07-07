import React from 'react';

import gameEngine from './anpEngine';
import anpViewData from "./anpViewData";
import {Joystick} from "react-joystick-component";

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

        return (
            <div className={"actNormal"}>
                Player View
                <div>
                    <Joystick size={100} sticky={false} baseColor="gray" stickColor="black" move={onMove} stop={onMove}/>
                </div>
            </div>
        );
    }
}
