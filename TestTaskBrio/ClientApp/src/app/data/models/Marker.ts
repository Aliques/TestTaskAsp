import { ICircle } from "./ICircle";

export class Marker implements ICircle {
    id?:number;
    x: number;
    y: number;
    radius: number;
    nextMarker: any;
    creatorName?:string;

    constructor(x: number, y: number, radius: number, creatorName?:string,id?:number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.creatorName = creatorName;
        this.id = id;
    }
}
