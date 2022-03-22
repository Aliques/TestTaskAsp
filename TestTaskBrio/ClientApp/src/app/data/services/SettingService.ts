import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SettingService {
    public movingObjectSpeed = new Subject<number>();

    public getMovingObjectSpeedValue(): Observable<number> {
        return this.movingObjectSpeed.asObservable();
      }


		public movingObjectSpeedValue(value: number):void {
   		this.movingObjectSpeed.next(value); 
  	}

     
}