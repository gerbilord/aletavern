import React, {useEffect, useState} from 'react';
import { Joystick } from 'react-joystick-component';
import Canvas from "Games/actNormal/anHost/anhCanvas";
import gameEngine from "./anhEngine";

export default (props)=>{

    let [x, setX] = useState(50);
    let [y, setY] = useState(100);

    let [xDir, setXDir] = useState(0);
    let [yDir, setYDir] = useState(0);

    let [color, setColor] = useState("green");

    useEffect(() => {

        let gameEngine : gameEngine = props.gameEngine;
        const onMove = (data)=>{
            let xDir = data.x;
            let yDir = data.y;
            // let amount = data.distance;

            setXDir(xDir);
            setYDir(yDir);
        }

        const onStop = (data)=>{
            setXDir(0);
            setYDir(0);
        }

        const onWsMessage = (data) =>{
            if(data.type === "MESSAGEGAME"){
                if (data.data){
                    if(data.data.type === 'move'){
                        onMove(data.data)
                    } else if(data.data.type === 'stop'){
                        onStop(data.data)
                    }
                    else if(data.data.type === 'color'){
                        setColor(data.data.color)
                    }
                }
            }
        }

        gameEngine.ws.onMessageGame.push(onWsMessage);

        const timer = setInterval(
            () => {
                let magnitude : number = Math.sqrt(Math.pow(xDir,2)+ Math.pow(yDir,2))
                let speed : number= 1.3;
                // console.log("x", xDir, magnitude, xDir/magnitude)
                // console.log("y", yDir, magnitude, xDir/magnitude)
                if(magnitude != 0){
                    setX(x+xDir/magnitude*speed);
                    setY(y-yDir/magnitude*speed);
                }


                }, 5);
        return () => clearInterval(timer);
    });

    return (
        <div className={"actNormal"}>
            <div>
                <Canvas x={x} y={y} width={1000} height={1000} color={color}/>
            </div>
        </div>
    );

}
