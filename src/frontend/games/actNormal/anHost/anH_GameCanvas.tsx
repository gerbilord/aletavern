import React, { useRef, useState, useEffect } from 'react'
import GameEngine from "Games/actNormal/anHost/anH_Engine";
import Shape from "Games/actNormal/anHost/anH_Shape";

const GameCanvas = props => {

    let gameEngine : GameEngine = props.gameEngine;

    const canvasRef = useRef(null)

    const drawAllShapes = (ctx) => {
        let shapesToDraw : Array<Shape> = gameEngine.allShapes;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        shapesToDraw.forEach((shape)=>{
            ctx.fillStyle = shape.color.curColor;
            ctx.beginPath()
            ctx.arc(shape.position.x, shape.position.y, shape.size, 0, 2*Math.PI)
            ctx.fill()
        });
    }


    useEffect(() => {

        const canvas = canvasRef.current
        // @ts-ignore
        const context = canvas.getContext('2d')
        let animationFrameId

        const render = () => {
            drawAllShapes(context)
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