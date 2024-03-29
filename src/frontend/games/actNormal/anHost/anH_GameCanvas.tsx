import React, { useRef, useState, useEffect } from 'react'
import GameEngine from "Games/actNormal/anHost/anH_Engine";
import Shape from "Games/actNormal/anHost/anH_Shape";
import {Circle, Rectangle} from "Games/actNormal/anHost/anH_ShapeProperties";

const GameCanvas = props => {

    let gameEngine : GameEngine = props.gameEngine;

    const canvasRef = useRef(null)

    const drawAllShapes = (ctx) => {
        let shapesToDraw : Array<Shape> = gameEngine.allShapes;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        shapesToDraw.forEach((shape)=>{
            if(shape.shapeProperties instanceof Circle){
                ctx.fillStyle = shape.color.curColor;
                ctx.beginPath();
                ctx.arc(shape.position.x, shape.position.y, shape.shapeProperties.radius, 0, 2*Math.PI);
                ctx.fill();
            } else if (shape.shapeProperties instanceof Rectangle){
                ctx.fillStyle = shape.color.curColor;
                ctx.fillRect(shape.position.x-shape.shapeProperties.width/2, shape.position.y-shape.shapeProperties.height/2, shape.shapeProperties.width, shape.shapeProperties.height);
            }
        });
    }

    const drawBorder = (ctx:CanvasRenderingContext2D) => {
        ctx.strokeStyle = 'white';
        let borderWidth = 12;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(borderWidth/2,borderWidth/2, ctx.canvas.width-borderWidth, ctx.canvas.height-borderWidth);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(borderWidth, borderWidth, ctx.canvas.width-borderWidth*2, ctx.canvas.height-borderWidth*2);
    }


    useEffect(() => {

        const canvas = canvasRef.current
        // @ts-ignore
        const context = canvas.getContext('2d')
        let animationFrameId

        const render = () => {
            drawAllShapes(context);
            drawBorder(context);
            animationFrameId = window.requestAnimationFrame(render)
        }

        window.requestAnimationFrame(render)

        return () => {
            window.cancelAnimationFrame(animationFrameId)
        }
    }, [drawAllShapes])

    return <canvas ref={canvasRef} width={gameEngine.boardSize} height={gameEngine.boardSize}/>
}

export default GameCanvas