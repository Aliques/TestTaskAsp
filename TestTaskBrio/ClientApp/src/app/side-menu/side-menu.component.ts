import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SettingService } from '../data/services/SettingService';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  providers:[SettingService]
})
export class SideMenuComponent implements OnInit {

  public movingObjectSpeedValue: number = 2;
 

  constructor(private readonly settingService: SettingService) { }

  ngOnInit(): void {
  }

  speedChanged(): void {
    this.settingService.movingObjectSpeedValue(this.movingObjectSpeedValue);
  }
  
}
