import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SettingService } from '../data/services/SettingService';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  public movingObjectSpeedValue: number = 10;
  public movingObjectSpeedMaxValue: number = 15;
  public movingObjectSpeedMinValue: number = 1;

  constructor(private readonly settingService: SettingService) { }

  ngOnInit(): void {
  }

  speedChanged(value:number): void {
    if(value>this.movingObjectSpeedMaxValue)
    {
      this.movingObjectSpeedValue = this.movingObjectSpeedMaxValue;
      this.settingService.movingObjectSpeedValue(this.movingObjectSpeedMaxValue);
      return;
    }
    if(value<this.movingObjectSpeedMaxValue){
      this.movingObjectSpeedValue = this.movingObjectSpeedMinValue;
      this.settingService.movingObjectSpeedValue(this.movingObjectSpeedMinValue);
      return;
    }
    this.settingService.movingObjectSpeedValue(value);
  }
  
}
