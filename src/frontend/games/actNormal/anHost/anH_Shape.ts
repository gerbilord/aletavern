import Color from "Games/actNormal/anHost/anH_Color";
import Direction from "Games/actNormal/anHost/anH_Direction";
import Position from "Games/actNormal/anHost/anH_Position";
import {ShapeProperties} from "Games/actNormal/anHost/anH_ShapeProperties";

export default class Shape {
    public id : number;
    public isPlayer : boolean;
    public teamId : number;

    public position : Position;
    public direction : Direction;
    public speed : number;

    public shapeProperties : ShapeProperties;
    public color : Color;
}