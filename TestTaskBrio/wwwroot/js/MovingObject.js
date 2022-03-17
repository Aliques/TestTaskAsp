var MovingObject = /** @class */ (function () {
    function MovingObject(context, x, y, dx, dy) {
        this.dx = 0;
        this.dy = 0;
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.context = context;
    }
    MovingObject.prototype.draw = function () {
        this.context.beginPath();
        this.context.arc(this.x, this.y, 15, 0, Math.PI * 2, false);
        this.context.strokeStyle = "#5333ed";
        this.context.stroke();
        this.context.fill();
        //this.update();
    };
    return MovingObject;
}());
export { MovingObject };
//# sourceMappingURL=MovingObject.js.map