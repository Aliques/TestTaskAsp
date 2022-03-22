import { Injectable } from "@angular/core";
import { HttpClient } from "@microsoft/signalr";

@Injectable()
export class HttpService{
  
    constructor(private http: HttpClient){ }
      
    getData(){
        return this.http.get('markers')
    }
}