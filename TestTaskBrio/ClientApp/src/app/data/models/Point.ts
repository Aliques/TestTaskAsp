import { ICircle } from "./ICircle";

export class Marker implements ICircle {

    x: number;
    y: number;
    radius: number;
    nextMarker: any;

    constructor(x: number, y: number, radius: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
}

export class NeighborMarker {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
