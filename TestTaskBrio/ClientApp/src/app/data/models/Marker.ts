import { ICircle } from "./ICircle";

export class Marker implements ICircle {
    id?:number;
    x: number;
    y: number;
    radius: number;
    nextMarker: any;
    name?:string;
    creationTime:Date;

    constructor(x: number, y: number, radius: number, name?:string,id?:number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.name = name;
        this.id = id;
    }
}
