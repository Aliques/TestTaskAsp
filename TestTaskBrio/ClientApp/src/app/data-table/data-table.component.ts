import {  Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Marker } from '../data/models/Marker';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() markers: Marker[];
  @Output() deleteMarkerEvent = new EventEmitter<number>();
  constructor() {
  }
  
  delete(id:any){
    this.deleteMarkerEvent.emit(id);
  }
  ngOnInit(): void {
  }
}
