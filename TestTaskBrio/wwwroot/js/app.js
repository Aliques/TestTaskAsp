import { Point } from "./Point.js";
import { MovingObject } from "./MovingObject.js";
window.onload = function () {
    var wrapper = document.getElementById("canvas-wrapper");
    var canvas = document.getElementById("canvas");
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
    var ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    var direction; //направление
    var pointsArry = [];
    var currentPoint;
    var movingObject;
    canvas.onmousedown = function (event) {
        var point = new Point(ctx, event.offsetX, event.offsetY, 10);
        currentPoint = point;
        pointsArry.push(currentPoint);
        currentPoint.drawPoint();
        if (pointsArry.length > 1) {
            currentPoint.previouspoint = pointsArry[pointsArry.length - 2];
            Move();
        }
        if (pointsArry.length == 1) {
            movingObject = new MovingObject(ctx, event.offsetX, event.offsetY, 8, 8);
            movingObject.draw();
        }
        movingObject.dx = (movingObject.x - currentPoint.x) / 200 * -1;
        movingObject.dy = (movingObject.y - currentPoint.y) / 200 * -1;
    };
    function Move() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < pointsArry.length; i++) {
            pointsArry[i].drawPoint();
        }
        movingObject.draw();
        var shouldMove = Math.abs(movingObject.x - currentPoint.x) > 1 ||
            Math.abs(movingObject.y - currentPoint.y) > 1;
        if (shouldMove) {
            movingObject.x += movingObject.dx;
            movingObject.y += movingObject.dy;
        }
        else {
            movingObject.dx = 0;
            movingObject.dy = 0;
        }
        requestAnimationFrame(Move);
    }
};
//# sourceMappingURL=app.js.map