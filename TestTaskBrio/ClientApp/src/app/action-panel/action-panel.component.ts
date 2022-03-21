import { Component, ElementRef, OnInit, ViewChild, Input, Output, HostListener } from '@angular/core';
import { MovingObject } from '../data/models/MovingObject';
import { Marker } from '../data/models/Marker';
import * as SignalR from "@microsoft/signalr"
import { ICircle } from '../data/models/ICircle';
import { Subscription } from 'rxjs';
import { DataTableComponent } from '../data-table/data-table.component';
import { HttpClient } from '@angular/common/http';
import { style } from '@angular/animations';

@Component({
  selector: 'app-action-panel',
  templateUrl: './action-panel.component.html',
  styleUrls: ['./action-panel.component.scss'],
})


export class ActionPanelComponent implements OnInit {
  @ViewChild(DataTableComponent) dataTableComponentInstance: DataTableComponent;
  @ViewChild('canvasWrapper') canvasWrapper: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('file', { static: true }) file: ElementRef<HTMLInputElement>;
  @ViewChild('fileName', { static: true }) fileName: ElementRef<HTMLLabelElement>;
  @ViewChild('uploadBtn', { static: true }) uploadBtn: ElementRef<HTMLButtonElement>;

  ctx: any;
  markersArray: Marker[] = [];  //main markers array
  currentTarget: Marker;        //current target
  selectedMarker: Marker = null; // selected marker in table
  movingObject: MovingObject;   // main moving object
  hubConnection: SignalR.HubConnection;
  markersfromFile: Marker[] = [];

  //graphics settings
  movingObjStrokeColor: string = "#0080E7";
  markerStrokeColor: string = "#9254cd";
  movingObjSize: number = 10;
  markersRadius: number = 8;
  private subscription: Subscription;
  animationReques?: number;   //animation cancelation (like cancelation token)
  name: string;
  constructor(private http: HttpClient) { }

  startConnection = () => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl("https://localhost:44332/points")
      .build();
    this.removeAllMarkers();
    this.deleteMarkerListener();
    this.initMarkers();
    this.newMarkerListener();
    this.hubConnection
      .start()
      .then(() => console.log("started"))
      .catch((err) => console.log(err));
  }

  //Hub methods
  newMarkerListener() {
    this.hubConnection.on("GetNewMarker", (marker: Marker) => {
      let newMarker = new Marker(marker.x, marker.y, marker.radius, marker.name, marker.id);
      this.markersArray.push(newMarker);
      this.createPoint(newMarker);
      this.refreshDataTable();
    });;
  }

  removeAllMarkers() {
    this.hubConnection.on("RemoveAllMarkers", () => {
      this.markersArray = [];
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      cancelAnimationFrame(this.animationReques);
      if(this.markersfromFile.length){
        this.markersArray = this.markersfromFile;
        let firstMarker = this.markersArray[0];
        this.movingObject = new MovingObject(firstMarker.x, firstMarker.y, 10);
        this.currentTarget = this.markersArray[1];
        this.restoreLinks();
        this.update();
        this.refreshDataTable();
        this.markersfromFile = [];
        return;
      }
      this.refreshDataTable();
      this.markersfromFile = [];
    });;
  }

  deleteMarkerListener() {
    this.hubConnection.on("DeleteMarker", (deleted: Marker) => {
      let id = deleted.id;

      this.http.delete('/Markers', { body: deleted })
        .subscribe((result: any) => {
          this.markersArray = this.markersArray.filter(m => m.id !== id);
          if (this.markersArray.length <= 1) {
            this.movingObject = null;
            if (this.markersArray.length == 0) {
              cancelAnimationFrame(this.animationReques);
              this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
            }
          }
          this.restoreLinks();
          this.refreshDataTable();
        },
          response => {
            console.log("DELETE call in error", response);
          });
    });;
  }

  initMarkers() {
    this.hubConnection.on("GetAllMarkers", (array: Marker[]) => {
      if (array.length) {
        this.markersArray = array;
        this.movingObject = new MovingObject(this.markersArray[0].x, this.markersArray[0].y, this.movingObjSize);

        this.restoreLinks();
        this.update();
      }
    });
  }

  restoreLinks() {
    if (this.markersArray.length > 1) {
      for (let index = 0; index < this.markersArray.length; index++) {
        if (index !== this.markersArray.length) {
          this.markersArray[index].nextMarker = this.markersArray[index + 1];
        }
      }
      this.currentTarget = this.markersArray[0];
    }
  }

  onResize() {
    this.canvas.nativeElement.width = this.canvasWrapper.nativeElement.offsetWidth * 0.5;
    this.canvas.nativeElement.height = 700;
  }

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.startConnection();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteMarker(number: number) {
    let marker = this.markersArray.filter(m => m.id === number)[0];
    this.hubConnection.invoke("DeleteMarker", marker);
  }

  ngAfterViewInit() {
    this.canvas.nativeElement.width = this.canvasWrapper.nativeElement.offsetWidth * 0.5;
    this.canvas.nativeElement.height = 500;

  }

  onmousedownHandler(event: MouseEvent) {
    var marker = new Marker(event.offsetX, event.offsetY, this.markersRadius, this.name);
    let passMark = marker;
    passMark.nextMarker = undefined;
    this.hubConnection.invoke("GetNewMarker", passMark);
    this.refreshDataTable();
  }

  createPoint = (marker: Marker) => {
    if (this.markersArray.length > 1) {
      this.markersArray[this.markersArray.length - 2].nextMarker = marker;
    }

    if (this.markersArray.length == 2) {
      this.currentTarget = marker;
      this.movingObject = new MovingObject(this.markersArray[this.markersArray.length - 2].x, this.markersArray[this.markersArray.length - 2].y, this.movingObjSize);
      this.movingObject.dx = 8;
      this.movingObject.dy = 8;
      this.drawCirclePoint(this.movingObject, this.movingObjStrokeColor);
      this.update();
    }
    this.drawCirclePoint(marker, this.markerStrokeColor);
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for (var i = 0; i < this.markersArray.length; i++) {
      this.drawCirclePoint(this.markersArray[i], this.markerStrokeColor);
    }
    this.drawCirclePoint(this.movingObject, this.movingObjStrokeColor);
    this.StartMove();
    this.drawSelectedTableMarker();
    this.animationReques = requestAnimationFrame(this.update.bind(this));
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

  remooveAllMarkers() {
    this.hubConnection.invoke("RemoveAllMarkers");
  }

  refreshDataTable() {
    this.dataTableComponentInstance.refreshTable();
  }

  selectedTableMarker(marker: Marker) {
    this.selectedMarker = new Marker(marker.x, marker.y, 16, null, marker.id);
  }

  drawSelectedTableMarker() {
    if (this.selectedMarker !== null)
      this.drawCirclePoint(this.selectedMarker, "#007acc");
  }

  tableRowUnselectedSelectedEvent() {
    this.selectedMarker = null;
  }


  serializationMarkersArray() {
    let data = JSON.stringify(this.markersArray, ["id", "x", "y", "radius", "name", "creationTime"]);
    let blob = new Blob([data], { type: "text/plain" });
    let downloadLink = document.createElement("a")
    downloadLink.setAttribute("href", URL.createObjectURL(blob));
    downloadLink.setAttribute("download", Date.now() + "data.txt");
    downloadLink.click();
  }

  fileUploaded(event: any) {
    if (this.file.nativeElement.files.length) {
      this.file.nativeElement.files = event.target.files;
      let file = this.file.nativeElement.files[0];
      const fileSize = (file.size / 1024).toFixed(2);
      const fileNameAndSize = `${file.name} - ${fileSize}KB`;
      this.fileName.nativeElement.textContent = fileNameAndSize;
      this.fileName.nativeElement.style.fontSize = "10px";
      this.fileName.nativeElement.style.textAlign = "center";
      console.log(this.uploadBtn)
    } 
  }

  initFromFile(data: any) {
    let markers: Marker[] = JSON.parse(data);

    if (!markers.length) {
      alert("No data! :(")
      return;
    }
    this.markersfromFile = markers;
    this.hubConnection.invoke("RemoveAllMarkers");
    
  }


  uploadBtnClick() {
    if (this.file.nativeElement.files.length) {
      let reader = new FileReader();
      reader.readAsText(this.file.nativeElement.files[0]);

      reader.onload = () => {
        this.initFromFile(reader.result);
      };
      let a = 0;
      reader.onerror = function () {
        console.log(reader.error);
      };
    }
  }


}
