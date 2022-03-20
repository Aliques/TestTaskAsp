import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { Marker } from '../data/models/Marker';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() markers: Marker[];
  //markers:Marker[]=[new Marker(1,2,3,"asd",4),new Marker(41,22,34,"qwe",8)]
  constructor() {
  }
  delete(id:any){
    console.log(id) 
  }
  ngOnInit(): void {
  }
}
