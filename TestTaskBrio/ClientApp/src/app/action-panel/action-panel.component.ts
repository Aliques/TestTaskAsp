import { Component, ElementRef, OnInit, ViewChild, Input, Output, HostListener } from '@angular/core';
import { MovingObject } from '../data/models/MovingObject';
import { Marker, NeighborMarker } from '../data/models/Point';
import * as SignalR from "@microsoft/signalr"
import { ICircle } from '../data/models/ICircle';
import { LinkedList } from '../data/LinkedList';

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss']
})


export class ActionPanelComponent implements OnInit {
  @ViewChild('canvasWrapper') canvasWrapper: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  ctx: any;
  markersArray: Marker[] = [];
  currentTarget: Marker;
  movingObject: MovingObject;
  hubConnection: SignalR.HubConnection;
  movingObjStrokeColor: string = "#0080E7";
  markerStrokeColor: string = "#9254cd";
  movingObjSize: number = 10;
  markersRadius: number = 8;
  list: LinkedList;


  startConnection = () => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl("https://localhost:44332/points")
      .build();
    this.initPoint();
    this.newPointsListener();
    this.hubConnection
      .start()
      .then(() => console.log("started"))
      .catch((err) => console.log(err));
  }

  //Hub methods
  newPointsListener() {
    this.hubConnection.on("GetNewMarker", (marker: Marker) => {
      let newMarker = new Marker(marker.x, marker.y, marker.radius);
      this.markersArray.push(newMarker);
      this.createPoint(newMarker);
    });;
  }

  initPoint() {
    this.hubConnection.on("GetAllMarkers", (array: Marker[]) => {
      if (array.length) {
        this.markersArray = array;
        this.movingObject = new MovingObject(this.markersArray[0].x, this.markersArray[0].y, this.movingObjSize);

        if (this.markersArray.length > 1) {
          for (let index = 0; index < this.markersArray.length; index++) {
            if (index !== this.markersArray.length) {
              let prev = this.markersArray[index];
              this.markersArray[index].nextMarker = this.markersArray[index + 1];
            }
          }

          this.currentTarget = this.markersArray[0];
        }
        this.update();
      }
    });
  }

  constructor() { }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.startConnection();
  }


  ngAfterViewInit() {
    // this.canvas.nativeElement.width = this.canvasWrapper.nativeElement.offsetWidth;
    // this.canvas.nativeElement.height = this.canvasWrapper.nativeElement.offsetHeight ;

  }

  onmousedownHandler(event: MouseEvent) {
    var marker = new Marker(event.offsetX, event.offsetY, this.markersRadius);
    this.markersArray.push(marker);
    this.createPoint(marker);
    let passMark = marker;
    passMark.nextMarker = undefined;
    this.hubConnection.invoke("GetNewMarker", passMark);
  }

  createPoint = (marker: Marker) => {
    if (this.markersArray.length > 1) {
      this.markersArray[this.markersArray.length - 2].nextMarker = marker;
      marker.nextMarker = this.markersArray[this.markersArray.length - 1];
    }

    if (this.markersArray.length == 2) {
      this.currentTarget = marker;
      this.movingObject = new MovingObject(this.markersArray[this.markersArray.length - 2].x, this.markersArray[this.markersArray.length - 2].y, this.movingObjSize);
      this.movingObject.dx = 8;
      this.movingObject.dy = 8;
      this.drawCirclePoint(this.movingObject, this.movingObjStrokeColor);
      this.update();
    }
    //addPointToTable(point);
    this.drawCirclePoint(marker, this.markerStrokeColor);
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for (var i = 0; i < this.markersArray.length; i++) {
      this.drawCirclePoint(this.markersArray[i], this.markerStrokeColor);
    }
    this.drawCirclePoint(this.movingObject, this.movingObjStrokeColor);
    this.StartMove();
    requestAnimationFrame(this.update.bind(this));
  }

  StartMove() {
    let mObj = this.movingObject;
    if (Math.abs(mObj.x - this.currentTarget.x) < mObj.dx && Math.abs(mObj.y - this.currentTarget.y) < mObj.dy) { //когда достигли цели
      this.movingObject.x = this.currentTarget.x;
      this.movingObject.y = this.currentTarget.y;
      if (this.currentTarget == this.markersArray[this.markersArray.length - 1]) {
        this.currentTarget = this.markersArray[0];
      } else {
        this.currentTarget = this.currentTarget.nextMarker;
      }
    }
    else { //считаем след. кооординату
      const opp = this.currentTarget.y - mObj.y;
      const adj = this.currentTarget.x - mObj.x;
      const angle = Math.atan2(opp, adj);
      this.movingObject.x += (Math.cos(angle) * mObj.dx);
      this.movingObject.y += (Math.sin(angle) * mObj.dy);

    }
  }

  drawCirclePoint(marker: ICircle, strokeStyle?: string | CanvasGradient | CanvasPattern) {
    this.ctx.beginPath();
    this.ctx.arc(marker.x, marker.y, marker.radius, 0, Math.PI * 2, false);
    this.ctx.strokeStyle = strokeStyle ?? "#819830";
    this.ctx.stroke();
  }
}
