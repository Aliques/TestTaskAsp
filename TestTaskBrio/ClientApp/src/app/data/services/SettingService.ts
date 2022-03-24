import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GraphicsSettings } from './GraphicsSettings';

@Injectable()

export class SettingService {
  private movingObjectSpeed = new BehaviorSubject<number>(10);
  movingObjSpeed = this.movingObjectSpeed.asObservable();

  getMovingObjectSpeed(){
    return this.movingObjectSpeed.value;
  }

  public movingObjectSpeedValue(value: number): void {
    this.movingObjectSpeed.next(value);
  }


  private movingObjectRadius = new BehaviorSubject<number>(8);
  ovingObjRadius = this.movingObjectRadius.asObservable();

  getmovingObjectRadius(){
    return this.movingObjectRadius.value;
  }

  public movingObjectRadiusValue(value: number): void {
    this.movingObjectRadius.next(value);
  }


  private movingObjectFillColor = new BehaviorSubject<string>(GraphicsSettings.movingObjectFillColorDefault);
  movingObjFillColor = this.movingObjectFillColor.asObservable();

  getmovingObjectFillColor(){
    return this.movingObjectFillColor.value;
  }
  
  public movingObjectFillColorValue(value: string): void {
    this.movingObjectFillColor.next(value);
  }

  private markerFillColor = new BehaviorSubject<string>(GraphicsSettings.markerFillColorDefault);
  staticmarkerFillColor = this.markerFillColor.asObservable();

  getmarkerFillColor(){
    return this.markerFillColor.value;
  }
  
  public markerFillColorValue(value: string): void {
    this.markerFillColor.next(value);
  }
  
}