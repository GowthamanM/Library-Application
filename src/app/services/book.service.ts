import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl:string;

  constructor(private http: HttpClient) {
    this.apiUrl = 'http://localhost:3000/books';
  }

  public getBooks():Observable<any>{
      return this.http.get<any>(this.apiUrl);
  }
  public addBook(data:Book){
    return this.http.post(this.apiUrl+'/addBook',data);
  }

  // delete a book
  public delete(data:any){
    return this.http.post(this.apiUrl+'/delete',data,{responseType: 'text'});
  }
}
