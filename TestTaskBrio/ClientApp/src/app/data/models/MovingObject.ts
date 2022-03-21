import { ICircle } from "./ICircle";

export class MovingObject implements ICircle{

    x: number;
    y: number;
    dx: number = 2;
    dy: number = 2;
    radius:number;

    constructor(x:number, y:number, radius:number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

