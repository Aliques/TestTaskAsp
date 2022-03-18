import { Point } from "./Point";

export class MovingObject {

    x: number;
    y: number;
    dx: number = 2;
    dy: number = 2;
    width: number;
    height: number;
    context: CanvasRenderingContext2D;
    direction: Direction = Direction.forward;

    constructor(context: CanvasRenderingContext2D, x, y, dx, dy,) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.context = context;
    }
    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, 15, 0, Math.PI * 2, false);
        this.context.strokeStyle = "#5333ed";
        this.context.stroke();

        this.context.fill();

        //this.update();
    }
    //update() {
    //    if (this.x + 15 > innerWidth || this.x - 15 < 0) {
    //        this.dx = -this.dx;
    //    }
    //    if (this.y + 15 > innerHeight || this.y - 15 < 0) {
    //        this.dy = -this.dy;
    //    }
    //    this.x += this.dx;
    //    this.y += this.dy;
    //}
}

export enum Direction {
    forward,
    back
}