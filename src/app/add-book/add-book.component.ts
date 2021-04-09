import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  books:Array<Book>=[];
  searchBooks:Array<Book>=[];
  searchInput:any='';
  constructor(private bookService:BookService,public router:Router) { 
    this.bookService.getBooks().subscribe((data)=>{
      this.books = data;
      this.searchBooks = JSON.parse(JSON.stringify(this.books));
    });

  }

  ngOnInit(): void {
    this.setBooks();   
  }

  setBooks(){
    
    console.log(this.searchBooks);
    
  }
  searchBook(){
    if(this.searchInput === ''){
      this.searchBooks = this.books;
      console.log(this.searchBooks);
    }else{
      this.searchBooks = this.books.filter(data => (data.book_id === this.searchInput || data.book_name === this.searchInput));
      console.log(this.searchBooks);
      console.log(this.books);
    }
  }

  deleteBook(data:any){
    this.bookService.delete(JSON.parse(JSON.stringify(data))).subscribe(()=>{
      this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
        this.router.navigate(['addBook']);
    });
    });
  }
}
