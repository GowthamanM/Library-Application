import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-add-book-form',
  templateUrl: './add-book-form.component.html',
  styleUrls: ['./add-book-form.component.css']
})
export class AddBookFormComponent implements OnInit {

  bookID:any;
  bookName:any;
  quantity:any;
  BookModel:Book = new Book();
  constructor(private bookService:BookService,public router:Router) { }

  ngOnInit(): void {
  }
  addBook(){
    this.BookModel.book_id=this.bookID;
    this.BookModel.book_name=this.bookName;
    this.BookModel.quantity = this.quantity;
    this.bookService.addBook(this.BookModel).subscribe(()=>{
      this.router.navigate(['addBook']);
    })
  }
}
