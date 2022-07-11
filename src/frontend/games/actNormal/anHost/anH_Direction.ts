export default class Direction {
    public x : number;
    public y : number;

    public whenSet : number | null;
    public whenStop : number | null;

    public isMoving() : boolean{
        return this.x != 0 || this.y !=0;
    }
}