import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckIn } from '../models/check-in';

@Injectable({
  providedIn: 'root'
})
export class LogService {

  private apiUrl:string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'http://localhost:3000/';
  }

  public getCheckIn(data:any):Observable<any>{
      return this.http.post<any>(this.apiUrl+'getLogs',data);
  }
}
