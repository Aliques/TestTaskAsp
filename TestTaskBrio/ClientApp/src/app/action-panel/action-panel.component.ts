import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MovingObject } from '../data/models/MovingObject';
import { Marker } from '../data/models/Marker';
import * as SignalR from "@microsoft/signalr"
import { ICircle } from '../data/models/ICircle';
import { Subscription } from 'rxjs';
import { DataTableComponent } from '../data-table/data-table.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { SettingService } from '../data/services/SettingService'
import { GraphicsSettings } from '../data/services/GraphicsSettings';

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
  movingObjectFillColor:string;
  staticMarkerFillColor:string = "#00E663";
  strokeStyle?: string ="#9254cd";
  movingObjStrokeColor: string;
  movingObjSize: number = GraphicsSettings.movingObjectRadiusDefault;
  markersRadius: number;
  selectedMarkerRadius:number = 16;
  movingObjectSpeed:number;
  private subscription: Subscription;
  animationReques?: number;   //animation cancelation (like cancelation token)
  name: string;
  constructor(private http: HttpClient, private  settingService: SettingService) {
   

   }
  
  ngOnInit(): void {
    this.settingsChanged();
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.startConnection();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  settingsChanged(): void{
    this.movingObjectSpeed = this.settingService.getMovingObjectSpeed();
    this.markersRadius = this.settingService.getmovingObjectRadius();
    this.movingObjectFillColor = this.settingService.getmovingObjectFillColor();
    this.staticMarkerFillColor = this.settingService.getmarkerFillColor();
    this.settingService.movingObjSpeed.subscribe(value => this.movingObjectSpeed = value);
    this.settingService.ovingObjRadius.subscribe(value => this.movingObject.radius = value);
    this.settingService.movingObjFillColor.subscribe(value => this.movingObjectFillColor = value);
    this.settingService.staticmarkerFillColor.subscribe(value => this.staticMarkerFillColor = value);
  }

  startConnection = () => {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl("/points")
      .build();
    this.removeAllMarkers();
    this.deleteMarkerListener();
    this.initMarkers();
    this.newMarkerListener();
    this.updateMarkers();
    this.hubConnection
      .start()
      .then(() => console.log("started"))
      .catch((err) => console.log(err));
  }

  //Hub methods
  newMarkerListener() {
    this.hubConnection.on("GetNewMarker", (marker: Marker) => {
      let newMarker = new Marker(marker.x, marker.y, marker.name, marker.id);
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
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let body = JSON.stringify(this.markersArray, ["x", "y", "name", "creationTime"]);
        this.http.post('/Markers/createMarkers', body ,{
          headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf8')
        })
        .subscribe((data:any) => {
          this.hubConnection.invoke("UpdateMarkers");
          this.markersfromFile = [];

        },error=>console.log(error));
        return;
      }
      this.refreshDataTable();
      this.markersfromFile = [];
    });
  }

  deleteMarkerListener() {
    this.hubConnection.on("DeleteMarker", (deleted: Marker) => {
      this.markersArray = this.markersArray.filter(m => m.id !== deleted.id);
      this.restoreLinks();
      this.refreshDataTable();
      if (this.markersArray.length == 0) {
        cancelAnimationFrame(this.animationReques);
        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      }
    });
  }

  refreshData(array:Marker[]){
    if (array.length) {
      this.markersArray = array;
      this.movingObject = new MovingObject(this.markersArray[0].x, this.markersArray[0].y, this.movingObjSize,this.movingObjectSpeed);

      this.restoreLinks();
      this.update();
    }
  }

  initMarkers() {
    this.hubConnection.on("GetAllMarkers", (array: Marker[]) => {
        this.refreshData(array);
    });
  }

  updateMarkers() {
    this.hubConnection.on("UpdateMarkers", (array: Marker[]) => {
      this.refreshData(array);
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

  deleteMarker(number: number) {
  
    let marker = this.markersArray.filter(m => m.id === number)[0];
    this.markersArray = this.markersArray.filter(m => m.id !== marker.id);
    this.refreshDataTable();
    this.restoreLinks();
    if (this.markersArray.length == 0) {
      cancelAnimationFrame(this.animationReques);
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }
    this.http.delete('/Markers', { body: marker })
        .subscribe((result: any) => {
          
          this.refreshDataTable();
        },
          response => {
            console.log("DELETE call in error", response);
          });
    this.hubConnection.invoke("DeleteMarker", marker);
  }

  ngAfterViewInit() {
    this.canvas.nativeElement.width = this.canvasWrapper.nativeElement.offsetWidth * 0.5;
    this.canvas.nativeElement.height = 500;

  }

  onmousedownHandler(event: MouseEvent) {
    var marker = new Marker(event.offsetX, event.offsetY, this.name);
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
      this.movingObject = new MovingObject(this.markersArray[this.markersArray.length - 2].x, 
        this.markersArray[this.markersArray.length - 2].y, this.movingObjSize,this.movingObjectSpeed);
      this.movingObject.dx = this.movingObjectSpeed;
      this.movingObject.dy = this.movingObjectSpeed;
      this.drawCirclePoint(this.movingObject, this.movingObject.radius, this.movingObjStrokeColor,this.movingObjectFillColor);
      this.update();
    }
    this.drawCirclePoint(marker, this.markersRadius, this.strokeStyle,this.staticMarkerFillColor);
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.movingObject.dx=this.movingObjectSpeed;
    this.movingObject.dy=this.movingObjectSpeed;
    for (var i = 0; i < this.markersArray.length; i++) {
      this.drawCirclePoint(this.markersArray[i], this.markersRadius, this.strokeStyle,this.staticMarkerFillColor);
    }
    this.drawCirclePoint(this.movingObject, this.movingObject.radius, this.movingObjStrokeColor,this.movingObjectFillColor);
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
      this.movingObject.x += ((Math.cos(angle) * mObj.dx) * (this.movingObjectSpeed*0.1));
      this.movingObject.y += ((Math.sin(angle) * mObj.dy) * (this.movingObjectSpeed * 0.1));

    }
  }

  drawCirclePoint(marker: ICircle, radius:number, strokeStyle?: string, fill?:string) {
    this.ctx.beginPath();
    this.ctx.arc(marker.x, marker.y, radius, 0, Math.PI * 2, false);
    this.ctx.strokeStyle = strokeStyle ?? "#819830";
    this.ctx.fillStyle = fill;
    this.ctx.fill();
    this.ctx.stroke();
  }

  remooveAllMarkers() {
    this.hubConnection.invoke("RemoveAllMarkers");
  }

  refreshDataTable() {
    this.dataTableComponentInstance.refreshTable();
  }

  selectedTableMarker(marker: Marker) {
    this.selectedMarker = new Marker(marker.x, marker.y, null, marker.id);
  }

  drawSelectedTableMarker() {
    if (this.selectedMarker !== null)
      this.drawCirclePoint(this.selectedMarker, this.selectedMarkerRadius, "#007acc");
  }

  tableRowUnselectedSelectedEvent() {
    this.selectedMarker = null;
  }


  serializationMarkersArray() {
    Date.prototype.toJSON = function(){ return moment(this).format(); }
    let data = JSON.stringify(this.markersArray, ["x", "y", "name", "creationTime"]);
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
      console.log(file)
      const fileNameAndSize = `${file.name}`;
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
    this.movingObjectSpeed+=1;
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
  dateTimeReviver(key:any, value:any) {
    var a;
    if (typeof value === 'string') {
        a = /\/Date\((\d*)\)\//.exec(value);
        if (a) {
            return new Date(+a[1]);
        }
    }
    return value;
}

}
