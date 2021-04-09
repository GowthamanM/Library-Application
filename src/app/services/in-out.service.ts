import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckIn } from '../models/check-in';

@Injectable({
  providedIn: 'root'
})
export class InOutService {

  private apiUrl:string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'https://e-lib1-default-rtdb.firebaseio.com/CheckIn.json';
  }

  public getCheckIn():Observable<CheckIn>{
      return this.http.get<CheckIn>(this.apiUrl);
  }
}
