"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.MovingObject = void 0;
var MovingObject = /** @class */ (function () {
    function MovingObject(context, x, y, dx, dy) {
        this.dx = 2;
        this.dy = 2;
        this.direction = Direction.forward;
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
    };
    return MovingObject;
}());
exports.MovingObject = MovingObject;
var Direction;
(function (Direction) {
    Direction[Direction["forward"] = 0] = "forward";
    Direction[Direction["back"] = 1] = "back";
})(Direction = exports.Direction || (exports.Direction = {}));
//# sourceMappingURL=MovingObject.js.map