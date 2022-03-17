window.onload = function () {
    var wrapper = document.getElementById("canvas-wrapper");
    var canvas = document.getElementById("canvas");
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    var direction; //направление
    var pointsArry = [];
    var movingObject;
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
    };
    function Move() {
        requestAnimationFrame(Move);
    }
};
var MovingObject = /** @class */ (function () {
    function MovingObject(context, x, y) {
        this.x = x;
        this.y = y;
    }
    MovingObject.prototype.Draw = function () {
    };
    return MovingObject;
}());
var Point = /** @class */ (function () {
    function Point(context, x, y, radius) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    Point.prototype.drawPoint = function () {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.strokeStyle = '#5333ed';
        this.context.stroke();
    };
    return Point;
}());
//# sourceMappingURL=app.js.map