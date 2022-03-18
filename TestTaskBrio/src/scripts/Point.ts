export class Point {

    x: number;
    y: number;
    radius: number;
    context: CanvasRenderingContext2D;
    previouspoint: Point;
    nextPoint: Point;

    constructor(context: CanvasRenderingContext2D, x: number, y: number, radius: number) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    drawPoint() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.strokeStyle = '#5333ed';
        this.context.stroke();
    }
}