export class ShapeProperties {
}

export type ShapeTypes = "circle" | "rectangle";

export class Circle extends ShapeProperties {
    public readonly shapeName : ShapeTypes = "circle";
    public radius : number = 10;
}

export class Rectangle extends ShapeProperties {
    public readonly shapeName : ShapeTypes = "rectangle";
    public width : number = 20;
    public height : number = 20;
}
