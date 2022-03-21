import {  Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Marker } from '../data/models/Marker';
import * as lodash from "lodash"
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() dataSource: Marker[];
  @Output() deleteMarkerEvent = new EventEmitter<number>();
  @Output() dataSourceChange = new EventEmitter<Marker[]>();
  @Output() tableRowSelectedEvent = new EventEmitter<Marker>();
  @Output() tableRowUnselectedSelectedEvent = new EventEmitter<any>();

  selecterMarkerId:number = 0;

  onDataSourceChange(dataSource: Marker[]){
         
    this.dataSource = dataSource;
    this.dataSourceChange.emit(dataSource);
}

  displayedColumns = ["id", "x", "y","name","creationTime", "Actions"];
  constructor(private http: HttpClient) {
  }
  tableSortChange(sortState: Sort)
  {
    switch (sortState.active) {
     case "name":
       this.dataSource = sortState.direction === "asc" ? 
       lodash.orderBy(this.dataSource,['name'],['asc']) : 
       lodash.orderBy(this.dataSource,['name'],['desc']);
       break;
      case "creationTime":
        
        this.dataSource = sortState.direction === "asc" ? lodash.orderBy(this.dataSource,['creationTime'],['asc']) : 
        lodash.orderBy(this.dataSource,['creationTime'],['desc']);
        break;
     default:
    }
  }
  
  deleteMarker(id:number)
  {
    this.deleteMarkerEvent.emit(id);
  }

  tableRowSelected(marker:Marker){
    this.tableRowSelectedEvent.emit(marker);
  }

  tableRowUnselected()
  {
    this.tableRowUnselectedSelectedEvent.emit();
  }

  ngOnInit(): void {
    
  }

  refreshTable() {
    this.http.get('/Markers').subscribe((data:any) => this.dataSource=data);
  }
}
