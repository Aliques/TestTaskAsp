import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GraphicsSettings } from '../data/services/GraphicsSettings';
import { SettingService } from '../data/services/SettingService';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  public movingObjectSpeedValue: number = GraphicsSettings.movingObjectSpeedDefault;
  public movingObjectSpeedMaxValue: number = GraphicsSettings.movingObjectSpeedMax;
  public movingObjectSpeedMinValue: number = GraphicsSettings.movingObjectSpeedMin;

  public movingObjectRadiusValue: number = GraphicsSettings.movingObjectRadiusDefault;
  public movingObjectRadiusMaxValue: number = GraphicsSettings.movingObjectRadiusMax;
  public movingObjectRadiusMinValue: number = GraphicsSettings.movingObjectRadiusMin;

  public movingObjectFillColorValue: string = GraphicsSettings.movingObjectFillColorDefault;
  public staticMarkerFillColorValue: string = GraphicsSettings.markerFillColorDefault;

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
    if(value<this.movingObjectRadiusMinValue){
      this.movingObjectSpeedValue = this.movingObjectSpeedMinValue;
      this.settingService.movingObjectSpeedValue(this.movingObjectSpeedMinValue);
      return;
    }
    this.settingService.movingObjectSpeedValue(value);
  }
  

  movingMarkerRadiusChanged(value:number){
    if(value>this.movingObjectRadiusMaxValue)
    {
      this.movingObjectRadiusValue = this.movingObjectRadiusMaxValue;
      this.settingService.movingObjectRadiusValue(this.movingObjectRadiusMaxValue);
      return;
    }
    if(value<this.movingObjectRadiusMinValue){
      this.movingObjectRadiusValue = this.movingObjectRadiusMinValue;
      this.settingService.movingObjectRadiusValue(this.movingObjectRadiusMinValue);
      return;
    }
    this.settingService.movingObjectRadiusValue(value);
  }

  movingMarkerFillColorChanged(value:string)
  {
    this.settingService.movingObjectFillColorValue(value);
  }

  staticMarkerFillColorChanged(value:string)
  {
    this.settingService.markerFillColorValue(value);
  }
}
