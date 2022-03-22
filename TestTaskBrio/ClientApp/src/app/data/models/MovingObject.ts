import { ICircle } from "./ICircle";

export class MovingObject implements ICircle{

    x: number;
    y: number;
    dx: number;
    dy: number;
    radius:number;

    constructor(x:number, y:number, radius:number, speed:number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = speed;
        this.dy = speed;
    }
}

