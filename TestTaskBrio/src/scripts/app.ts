import { Point } from "./Point.js"
import { MovingObject, Direction } from "./MovingObject.js"
import * as signalR from "@microsoft/signalr";


let wrapper = document.getElementById("canvas-wrapper")
let canvas = document.getElementById("canvas") as HTMLCanvasElement;
let tableBody = document.getElementById('pointsTableBody');

window.onload = function () {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight*0.9;
};

let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
let pointsArray: Point[] = [];
let currentTarget: Point;
let movingObject: MovingObject;


canvas.onmousedown = function (event) {
    var point = new Point(ctx, event.offsetX, event.offsetY, 10);
    pointsArray.push(point);

    if (pointsArray.length>1) {
        pointsArray[pointsArray.length - 2].nextPoint = point;
        point.previouspoint = pointsArray[pointsArray.length - 2];
    }

    if (pointsArray.length == 2) {
        currentTarget = point; // задать только один раз и только здесь
        movingObject = new MovingObject(ctx, point.previouspoint.x, point.previouspoint.y, 8, 8);
        movingObject.draw();
        update();
    }
    addPointToTable(point);
    point.drawPoint();
}

function StartMove() {
    if (Math.abs(movingObject.x - currentTarget.x) < movingObject.dx && Math.abs(movingObject.y - currentTarget.y) < movingObject.dy)
    { //когда достигли цели
        movingObject.x = currentTarget.x;
        movingObject.y = currentTarget.y;

        //определяем след. таргет
        changeDirection();
        chngeTarget();

    }
    else { //считаем след. кооординату
        const opp = currentTarget.y - movingObject.y;
        const adj = currentTarget.x - movingObject.x;
        const angle = Math.atan2(opp, adj);
        movingObject.x += Math.cos(angle) * movingObject.dx;
        movingObject.y += Math.sin(angle) * movingObject.dy;
    }
}

function changeDirection() {
    if (currentTarget == pointsArray[pointsArray.length - 1]) {
        movingObject.direction = Direction.back;
    }
    if (currentTarget == pointsArray[0]) {
        movingObject.direction = Direction.forward;
    }
}

function chngeTarget() {
    switch (movingObject.direction) {
        case Direction.forward:
            currentTarget = currentTarget.nextPoint;
            break;
        case Direction.back:
            currentTarget = currentTarget.previouspoint;
            break;
        default:
    }
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    movingObject.draw();
    for (var i = 0; i < pointsArray.length; i++) {
        pointsArray[i].drawPoint();
    }
    StartMove();
    requestAnimationFrame(update);
}

window.addEventListener('resize', function (event) {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight*0.9;
}, true);

function addPointToTable(point: Point) {
    var coordinatesCell = document.createElement('td');
    var userNamecell = document.createElement('td');
    var row = document.createElement('tr');
    coordinatesCell.appendChild(document.createTextNode(point.x.toString() + " : " + point.y.toString()));
    userNamecell.appendChild(document.createTextNode((<HTMLInputElement>document.getElementById('userName')).value));
    row.appendChild(coordinatesCell);
    row.appendChild(userNamecell);
    tableBody.appendChild(row);
}