import React, {useState} from "react";
import gameEngine from "Games/actNormal/anPlayer/anpEngine";
import GameWebSocket from "Frontend/GameWebSocket";

export default (props) => {
    const gameEngine : gameEngine = props.gameEngine;
    const ws : GameWebSocket = gameEngine.ws;

    const [color, setColor] = useState("green")
    const buttonPress = {type: "color", color:"red"}
    const buttonDePress = {type: "color", color:"green"}

    return <button style={{backgroundColor: color, borderRadius:"50%", width:200, height:200}} onTouchEnd={()=>{setColor("green"); ws.sendMessageToHost(buttonDePress)}} onTouchStart={()=>{setColor("red"); ws.sendMessageToHost(buttonPress)}}>A</button>
}