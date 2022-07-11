import anH_ViewData from "./anH_ViewData";
import GameWebSocket, {
    onJoinGamePayload, onMessageGamePayload,
    onOtherJoinGamePayload,
    onOtherReconnectGamePayload
} from "Frontend/GameWebSocket";
import Shape from "Games/actNormal/anHost/anH_Shape";
import Player from "Games/actNormal/anHost/anH_Player";
import Position from "Games/actNormal/anHost/anH_Position";
import Direction from "Games/actNormal/anHost/anH_Direction";
import Color from "Games/actNormal/anHost/anH_Color";
import {IJoystickUpdateEvent} from "react-joystick-component/build/lib/Joystick";
import anP_WsData from "Games/actNormal/anPlayer/anP_WsData";
import {shape} from "prop-types";

const bubblePopSound = new Audio("http://www.myinstants.com/media/sounds/bubble-pop.mp3");

export default class anH_Engine {
    public ws : GameWebSocket;
    public players : Array<Player> = [];
    public allShapes : Array<Shape> = [];

    private startTime : number = -1;
    private frameRate : number = 1000/60;
    private lastFrame : number = 0;
    private currentFrame : number = 0;

    public boardSize : number = 1000


    constructor(gameWebSocket:GameWebSocket) {
        this.ws = gameWebSocket;
        this.addHandleNewPlayers()
        this.addHandlePlayerInputs()
        this.addAiShapes()
        window.requestAnimationFrame(this.mainLoop.bind(this))
    }

    private getShapeFromPlayerId(playerId) : Shape | null {
        let playerShapeList = this.players.filter((player)=>{return player.wsId === playerId}).map(player=>player.shape);
        if(playerShapeList.length === 1){
            return playerShapeList[0];
        } else {
            return null;
        }
    }

    private addHandlePlayerInputs() : void {
        const onWsMessage = (data: onMessageGamePayload<anP_WsData>) =>{
            if(data.type === "MESSAGEGAME"){
                let shapeToMove = this.getShapeFromPlayerId(data.playerId);
                if (shapeToMove) {
                    if(data.data.type === 'move'){
                        let moveData:IJoystickUpdateEvent = data.data;
                        if(moveData.x !== null && moveData.y !== null){
                            shapeToMove.direction.x = moveData.x;
                            shapeToMove.direction.y = moveData.y;
                        }

                    } else if(data.data.type === 'stop'){
                        let moveData:IJoystickUpdateEvent = data.data;
                        shapeToMove.direction.x = 0;
                        shapeToMove.direction.y = 0;
                    }
                    else if(data.data.type === 'button'){
                        if(data.data.buttonId === 'A'){
                            if(data.data.direction === 'down'){
                                shapeToMove.color.curColor = shapeToMove.color.altColor
                                bubblePopSound.play();

                                this.getTouchingShapes(shapeToMove).forEach(touchedShape=>{
                                    touchedShape.color.mainColor = 'black';
                                    touchedShape.color.curColor = 'black';
                                });
                            } else {
                                shapeToMove.color.curColor = shapeToMove.color.mainColor
                            }
                        }
                    }
                }
            }
        }

        this.ws.onMessageGame.push(onWsMessage);
    }

    private addHandleNewPlayers(){
        const onNewPlayer = (data:onOtherJoinGamePayload) => {
            this.createNewPlayerWithShape(data.playerId);
        };

        const onReconnectPlayer = (data:onOtherReconnectGamePayload) => {
            let playerShape = this.getShapeFromPlayerId(data.playerId);
            if(!playerShape){
                this.createNewPlayerWithShape(data.playerId);
            }
        }

        this.ws.onOtherJoinGame.push(onNewPlayer);
        this.ws.onOtherReconnectGame.push(onReconnectPlayer);
    }

    private createNewPlayerWithShape(playerId:String){
        let teamId = 1;
        let newPlayer = new Player(); // TODO make dynamic
        newPlayer.teamId = teamId;
        newPlayer.wsId = playerId;

        let newPlayerPos = new Position();
        newPlayerPos.x = 100;
        newPlayerPos.y = 100;

        let newPlayerDirection = new Direction();
        newPlayerDirection.x = 0;
        newPlayerDirection.y = 0;

        let newPlayerColor = new Color();
        newPlayerColor.mainColor = 'green';
        newPlayerColor.altColor = 'red';
        newPlayerColor.curColor = newPlayerColor.mainColor;

        let newPlayerShape = new Shape();
        newPlayerShape.size = 10;
        newPlayerShape.isPlayer = true;
        newPlayerShape.teamId = teamId;
        newPlayerShape.type = 'circle';
        newPlayerShape.speed = .2;


        newPlayerShape.position  = newPlayerPos;
        newPlayerShape.direction  = newPlayerDirection;
        newPlayerShape.color = newPlayerColor;

        newPlayer.shape = newPlayerShape;

        this.players.push(newPlayer);
        this.allShapes.push(newPlayerShape)
    }

    private addNewShape(){
        let teamId = -1;

        let newPos = new Position();
        newPos.x = Math.floor(Math.random() * this.boardSize);
        newPos.y = Math.floor(Math.random() * this.boardSize);

        let newDirection = new Direction();
        newDirection.x = 0;
        newDirection.y = 0;

        let newColor = new Color();
        newColor.mainColor = 'green';
        newColor.altColor = 'red';
        newColor.curColor = newColor.mainColor;

        let newShape = new Shape();
        newShape.size = 10;
        newShape.isPlayer = false;
        newShape.teamId = teamId;
        newShape.type = 'circle';
        newShape.speed = .2;

        newShape.position  = newPos;
        newShape.direction  = newDirection;
        newShape.color = newColor;

        this.allShapes.push(newShape)
    }

    private addAiShapes() {
        let numOfAi = 50;
        for (let i = 0; i < numOfAi; i++) {
            this.addNewShape()
        }
    }

    private handleAllMovement(deltaTime) {
        this.allShapes.forEach(
            (shape) => {
                let xDir = shape.direction.x;
                let yDir = shape.direction.y;
                let magnitude : number = Math.sqrt(Math.pow(xDir,2)+ Math.pow(yDir,2))

                if (magnitude !== 0){
                    shape.position.x = shape.position.x + xDir/magnitude* shape.speed * deltaTime;
                    shape.position.y = shape.position.y - yDir/magnitude* shape.speed * deltaTime;
                }
            }
        )
    }

    private mainLoop(highResTimeStamp){  // time in ms accurate to 1 micro second 1/1,000,000th second
        let deltaTime = 0
        if(this.startTime === -1) {
            this.startTime = highResTimeStamp;
        } else {
            this.currentFrame = Math.round((highResTimeStamp - this.startTime) / this.frameRate);
            deltaTime = (this.currentFrame - this.lastFrame) * this.frameRate;
        }
        this.lastFrame = this.currentFrame;
        requestAnimationFrame(this.mainLoop.bind(this));

        this.setAiMovement(highResTimeStamp, deltaTime);
        this.handleAllMovement(deltaTime);
        this.clampAllPositions(deltaTime);
    }

    public getViewData() : anH_ViewData {
        return {allShapes: this.allShapes};
    }

    private getTouchingShapes(thisShape: Shape) : Array<Shape> {
        return this.allShapes.filter((aShape)=>{
            return this.areShapesTouching(aShape, thisShape)
        });
    }

    private areShapesTouching(shape1: Shape, shape2: Shape):boolean{
        if(shape1===shape2){ // Same shape cannot touch itself.
            return false;
        }

        let addedSize = shape1.size + shape2.size;
        return addedSize >= this.getDistance(shape1, shape2);

    }

    private getDistance(shape1: Shape, shape2: Shape) : number {
        let y = shape1.position.y - shape2.position.y;
        let x = shape1.position.x - shape2.position.x;

        return Math.sqrt(x * x + y * y);
    }

    private setAiMovement(highResTimeStamp: number, deltaTime: number) {
        this.allShapes.filter((shape)=>{
            return !shape.isPlayer && this.shouldSetShapeMovement(shape, highResTimeStamp);})
            .forEach(
            (shape) => {
                // Do the next input for a random amount of time.
                shape.direction.whenSet = highResTimeStamp;
                shape.direction.whenStop = highResTimeStamp + Math.random() * 3000;

                // If the shape is moving, stop it, if it is stopped, move it.
                if(shape.direction.isMoving()){
                    shape.direction.x = 0;
                    shape.direction.y = 0;
                } else {
                    shape.direction.x = Math.random() * 100 - 50;
                    shape.direction.y = Math.random() * 100 - 50;
                }
            });
    }

    private shouldSetShapeMovement(shape:Shape, highResTimeStamp:number){
        return shape.direction.whenStop == null || shape.direction.whenStop < highResTimeStamp;
    }

    private clampAllPositions(deltaTime: number) {
        this.allShapes.forEach(shape=>{
            shape.position.x = this.clamp(shape.position.x, shape.size, this.boardSize - shape.size)
            shape.position.y = this.clamp(shape.position.y, shape.size, this.boardSize - shape.size)
        })
    }

    private clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    }
}