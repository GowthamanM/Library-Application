import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  apiURL:string;
  constructor(private http:HttpClient) {
    this.apiURL = 'http://localhost:3000/getStudents';
   }

  //get all the students from the Database
  public getStudents():Observable<any>{
    return this.http.get<any>(this.apiURL);
  }

  // save the student detail in database
  public saveStudent(data:any){
    return this.http.post(this.apiURL+'/save',data);
  }

  //pay the fees
  public payFees(data:any){
    return this.http.post(this.apiURL+'/pay',data);
  }

  // get books
  public getBooks(data:any):Observable<any>{
    return this.http.post(this.apiURL+'/books',data);
  }
}
