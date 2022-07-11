import React, {useState} from "react";
import gameEngine from "Games/actNormal/anPlayer/anP_Engine";
import GameWebSocket from "Frontend/GameWebSocket";
import ButtonId from "Games/actNormal/anPlayer/anP_ButtonId";


interface touchableButtonProps {
    gameEngine : gameEngine;
    buttonColor : any; // Hack since cannot use Property.backgroundColor
    buttonPressColor: String;
    buttonId : ButtonId;
}

type ButtonPressData = {type: "button", buttonId: ButtonId, direction: "down" }
type ButtonDePressData = {type: "button", buttonId: ButtonId, direction: "up" }

export {touchableButtonProps, ButtonPressData, ButtonDePressData}

export default (props:touchableButtonProps) => {

    const [color, setColor] = useState(props.buttonColor)

    const gameEngine : gameEngine = props.gameEngine;
    const ws : GameWebSocket = gameEngine.ws;
    const buttonColor : String = props.buttonColor;
    const buttonPressColor: String = props.buttonPressColor;
    const buttonId : ButtonId = props.buttonId;

    const buttonPress : ButtonPressData = {type: "button", buttonId: buttonId, direction: "down" }
    const buttonDePress : ButtonDePressData = {type: "button", buttonId: buttonId, direction: "up" }

    return <button
        style={{backgroundColor: color, borderRadius:"50%", width:200, height:200}}
        onTouchStart={()=>{setColor(buttonPressColor); ws.sendMessageToHost(buttonPress)}}
        onTouchEnd={()=>{setColor(buttonColor); ws.sendMessageToHost(buttonDePress)}}
    >
        {buttonId}
    </button>
}