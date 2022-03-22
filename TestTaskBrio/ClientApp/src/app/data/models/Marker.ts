import { ICircle } from "./ICircle";

export class Marker implements ICircle {
    id?:number;
    x: number;
    y: number;
    nextMarker: any;
    name?:string;
    creationTime:any;

    constructor(x: number, y: number, name?:string,id?:number) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.id = id;
    }
}
