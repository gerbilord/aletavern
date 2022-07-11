import React from 'react';

import gameEngine from './anP_Engine';
import anP_ViewData from "./anP_ViewData";
import TouchableButton from "./anP_touchableButton";
import {Joystick} from "react-joystick-component";

import "Games/actNormal/an.css";
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick";

export default class anP_View extends React.Component {
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
        const { viewData }:{viewData:anP_ViewData} = this.state;

        const onMove = (data:IJoystickUpdateEvent) =>{
            this.gameEngine.ws.sendMessageToHost(data)
        }

        // @ts-ignore
        return (
            <div className={"actNormal"}>
                <div className={"flexRow"}>
                    <Joystick throttle={50} size={200} sticky={false} baseColor="gray" stickColor="black" move={onMove} stop={onMove}/>
                    <TouchableButton
                        gameEngine={this.gameEngine}
                        buttonColor={'green'}
                        buttonPressColor={'red'}
                        buttonId={'A'}
                    />
                </div>
            </div>
        );
    }
}
