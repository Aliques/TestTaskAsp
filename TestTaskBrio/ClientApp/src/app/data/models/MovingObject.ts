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
//   draw(size?: number) {
//         let radius = size ?? 15;
//         this.context.beginPath();
//         this.context.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
//         this.context.strokeStyle = "#5333ed";
//         this.context.stroke();
//         this.context.fill();
//     }
}
