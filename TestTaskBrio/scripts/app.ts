
window.onload = () => {
    var wrapper = document.getElementById("canvas-wrapper")
    var canvas = document.getElementById("canvas") as HTMLCanvasElement;
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    let direction: number; //направление
    let pointsArry: Point[] = [];
    let movingObject: MovingObject;


    canvas.onmousedown = function (event) {
        var point = new Point(ctx, event.offsetX, event.offsetY, 10);
        pointsArry.push(point);
        point.drawPoint();

        if (pointsArry.length > 1) {
            Move();
        }

        if (pointsArry.length == 1) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var x = event.offsetX - 4;
            var y = event.offsetY - 4;
            ctx.fillRect(x, y, 8, 8);
            ctx.beginPath();

        }
    }

    function Move() {
        requestAnimationFrame(Move);
       
    }
};

class MovingObject {

    x: number;
    y: number;
    dx: number;
    dy: number;
    context: CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D, x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    Draw() {
        
    }
}

class Point {

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