import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()

export class SettingService {
  private movingObjectSpeed = new BehaviorSubject<number>(10);
  data = this.movingObjectSpeed.asObservable();

  public movingObjectSpeedValue(value: number): void {
    this.movingObjectSpeed.next(value);
  }
}