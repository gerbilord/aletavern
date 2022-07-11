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
import {Circle, Rectangle, ShapeTypes} from "Games/actNormal/anHost/anH_ShapeProperties";

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
        newPlayerPos.x = Math.floor(Math.random() * this.boardSize);
        newPlayerPos.y = Math.floor(Math.random() * this.boardSize);

        let newPlayerDirection = new Direction();
        newPlayerDirection.x = 0;
        newPlayerDirection.y = 0;

        let newPlayerColor = new Color();
        newPlayerColor.mainColor = 'green';
        newPlayerColor.altColor = 'red';
        newPlayerColor.curColor = newPlayerColor.mainColor;

        let newPlayerShape = new Shape();
        newPlayerShape.isPlayer = true;
        newPlayerShape.teamId = teamId;
        newPlayerShape.speed = .2;

        let typeNum = Math.floor(Math.random() * 2);
        let newPlayerShapeProperties;

        if (typeNum === 0){
            newPlayerShapeProperties = new Circle();
            newPlayerShapeProperties.radius = 10;
        } else {
            newPlayerShapeProperties = new Rectangle();
        }

        newPlayerShape.position  = newPlayerPos;
        newPlayerShape.direction  = newPlayerDirection;
        newPlayerShape.color = newPlayerColor;
        newPlayerShape.shapeProperties = newPlayerShapeProperties;

        newPlayer.shape = newPlayerShape;

        this.players.push(newPlayer);
        this.allShapes.push(newPlayerShape)
    }

    private addNewCircle(){
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

        let newShape : Shape = new Shape();
        newShape.isPlayer = false;
        newShape.teamId = teamId;
        newShape.speed = .2;


        let newShapeProperties : Circle = new Circle();
        newShapeProperties.radius = 10;

        newShape.position = newPos;
        newShape.direction = newDirection;
        newShape.color = newColor;
        newShape.shapeProperties = newShapeProperties;

        this.allShapes.push(newShape)
    }

    private addNewSquare(){
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

        let newShape : Shape = new Shape();
        newShape.isPlayer = false;
        newShape.teamId = teamId;
        newShape.speed = .2;


        let newShapeProperties : Rectangle = new Rectangle();
        newShapeProperties.width = 20;
        newShapeProperties.height = 20;

        newShape.position = newPos;
        newShape.direction = newDirection;
        newShape.color = newColor;
        newShape.shapeProperties = newShapeProperties;

        this.allShapes.push(newShape)
    }

    private addAiShapes() {
        let numOfAi = 40/2;
        for (let i = 0; i < numOfAi; i++) {
            this.addNewCircle();
            this.addNewSquare();
        }
    }

    private handleAllMovement(deltaTime) {
        this.allShapes.forEach(
            (shape) => {
                let xDir = shape.direction.x;
                let yDir = shape.direction.y;
                let magnitude : number = Math.sqrt(Math.pow(xDir,2)+ Math.pow(yDir,2));

                if (magnitude !== 0){
                    shape.position.x = shape.position.x + xDir/magnitude* shape.speed * deltaTime;
                    shape.position.y = shape.position.y - yDir/magnitude* shape.speed * deltaTime;
                }
            }
        )
    }

    private mainLoop(highResTimeStamp){  // time in ms accurate to 1 micro second 1/1,000,000th second
        let deltaTime = this.getDeltaTimeAndSetFrames(highResTimeStamp);
        requestAnimationFrame(this.mainLoop.bind(this));

        this.setAiMovement(highResTimeStamp, deltaTime);
        this.handleAllMovement(deltaTime);
        // this.clampAllPositions(deltaTime);
        this.wrapAllPositions(deltaTime);
        this.spreadPlague();
    }

    private getDeltaTimeAndSetFrames(highResTimeStamp) {
        let deltaTime = 0
        if (this.startTime === -1) {
            this.startTime = highResTimeStamp;
        } else {
            this.currentFrame = Math.round((highResTimeStamp - this.startTime) / this.frameRate);
            deltaTime = (this.currentFrame - this.lastFrame) * this.frameRate;
        }
        this.lastFrame = this.currentFrame;
        return deltaTime;
    }

    public getViewData() : anH_ViewData {
        return {allShapes: this.allShapes};
    }

    private getTouchingShapes(thisShape: Shape) : Array<Shape> {
        return this.allShapes.filter((aShape)=>{
            return this.areShapesTouching(aShape, thisShape)
        });
    }

    private areShapesTouching(shape1: Shape, shape2: Shape) : boolean {
        if(shape1===shape2){ // Same shape cannot touch itself.
            return false;
        }
        if(shape1.shapeProperties instanceof Circle && shape2.shapeProperties instanceof Circle){
            return this.areCirclesTouching(shape1, shape2);
        } else if(shape1.shapeProperties instanceof Rectangle && shape2.shapeProperties instanceof Rectangle){
            return this.areRectanglesTouching(shape1, shape2);
        } else { // Assume rectangle and circle
            if(shape1.shapeProperties instanceof Circle && shape2.shapeProperties instanceof Rectangle){
                return this.isCircleAndRectangleColliding(shape1, shape2);
            } else if(shape2.shapeProperties instanceof Circle && shape1.shapeProperties instanceof Rectangle){
                return this.isCircleAndRectangleColliding(shape2, shape1);
            }
            return false;
        }
    }

    private areCirclesTouching(circle1: Shape, circle2: Shape) {
        let circleProps1 = circle1.shapeProperties as Circle;
        let circleProps2 = circle2.shapeProperties as Circle;

        let addedSize = circleProps1.radius + circleProps2.radius;
        return addedSize >= this.getCenterDistances(circle1, circle2);
    }

    private areRectanglesTouching(rect1 : Shape, rect2 : Shape) : boolean {
        let rectProps1 = rect1.shapeProperties as Rectangle;
        let rectProps2 = rect2.shapeProperties as Rectangle;

        let rect1width = rectProps1.width;
        let rect1height = rectProps1.height;

        let rect2width = rectProps2.width;
        let rect2height = rectProps2.height;

        let rect1x = rect1.position.x - rectProps1.width/2;
        let rect1y = rect1.position.y- rectProps1.height/2;

        let rect2x = rect2.position.x - rectProps2.width/2;
        let rect2y = rect2.position.y- rectProps2.height/2;

        return !(
            ((rect1y + rect1height) < (rect2y)) ||
            (rect1y > (rect2y + rect2height)) ||
            ((rect1x + rect1width) < rect2x) ||
            (rect1x > (rect2x + rect2width))
        );
    }

    private getCenterDistances(shape1: Shape, shape2: Shape) : number {
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
            if(shape.shapeProperties instanceof Circle){
                shape.position.x = this.clamp(shape.position.x, shape.shapeProperties.radius, this.boardSize - shape.shapeProperties.radius);
                shape.position.y = this.clamp(shape.position.y, shape.shapeProperties.radius, this.boardSize - shape.shapeProperties.radius);
            } else if(shape.shapeProperties instanceof Rectangle){
                shape.position.x = this.clamp(shape.position.x, shape.shapeProperties.width/2, this.boardSize - shape.shapeProperties.width/2);
                shape.position.y = this.clamp(shape.position.y, shape.shapeProperties.height/2, this.boardSize - shape.shapeProperties.height/2);
            }
        });
    }

    private wrapAllPositions(deltaTime: number) {
        this.allShapes.forEach(shape=>{
            if(shape.shapeProperties instanceof Circle){
                shape.position.x = this.wrap(shape.position.x, shape.shapeProperties.radius, this.boardSize - shape.shapeProperties.radius);
                shape.position.y = this.wrap(shape.position.y, shape.shapeProperties.radius, this.boardSize - shape.shapeProperties.radius);
            } else if(shape.shapeProperties instanceof Rectangle){
                shape.position.x = this.wrap(shape.position.x, shape.shapeProperties.width/2, this.boardSize - shape.shapeProperties.width/2);
                shape.position.y = this.wrap(shape.position.y, shape.shapeProperties.height/2, this.boardSize - shape.shapeProperties.height/2);
            }
        });
    }

    private clamp(number, min, max) {
        return Math.max(min, Math.min(number, max));
    }

    private wrap(number, min, max) {

        return ((number % max) + max) % max;
        /*if(number> max){
            return min;
        } else if (number < min){
            return max;
        } else {
            return number;
        }*/
    }

    private spreadPlague() {
        this.allShapes.forEach((shape, index)=>{
            if (shape.color.mainColor == 'black'){
                this.allShapes
                    .filter(aShape=>aShape.color.mainColor!='black')
                    .filter(aShape=>{return this.areShapesTouching(aShape, shape)})
                    .filter((touchingShape)=> !touchingShape.isPlayer && touchingShape.color.mainColor != 'black')
                    .forEach(touchingShape=>{
                        touchingShape.color.mainColor = 'black';
                        touchingShape.color.curColor = 'black';
                    });
            }
        });
    }

    // return true if the rectangle and circle are colliding
    private isCircleAndRectangleColliding(circleShape : Shape, rectangleShape : Shape){

        let circleProperties = circleShape.shapeProperties as Circle;
        let rectangleProperties = rectangleShape.shapeProperties as Rectangle;

        let distX = Math.abs(circleShape.position.x - rectangleShape.position.x);
        let distY = Math.abs(circleShape.position.y - rectangleShape.position.y);

        if (distX > (rectangleProperties.width/2 + circleProperties.radius)) { return false; }
        if (distY > (rectangleProperties.height/2 + circleProperties.radius)) { return false; }

        if (distX <= (rectangleProperties.width/2)) { return true; }
        if (distY <= (rectangleProperties.height/2)) { return true; }

        let dx=distX-rectangleProperties.width/2;
        let dy=distY-rectangleProperties.height/2;
        return (dx*dx+dy*dy<=(circleProperties.radius*circleProperties.radius));
    }
}