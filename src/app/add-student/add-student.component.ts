import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService } from '../services/book.service';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {
  id_tag:any;
  studentData:any={};
  searchStudents:any;
  searchInput:any;
  books:any;
  isEmpty:any=true;found:any=false;
  constructor(private studentService:StudentService,public router:Router) { 
    this.studentService.getStudents().subscribe((data)=>{
      this.studentData = data;
      // this.searchStudents = JSON.parse(JSON.stringify(this.studentData));
    })
    this.searchInput = '';
  }

  ngOnInit(): void {
  }
  searchStudent(){
    if(this.searchInput === ''){
      this.isEmpty = true;
    }else{
      this.isEmpty=false;
      this.searchStudents = this.studentData.filter((data: any)=> (data.email === this.searchInput));
      console.log(this.searchStudents);
      if(this.searchStudents.length === 0){
        this.found = true;
      }else{
        this.found=false;
        this.studentService.getBooks(JSON.parse(JSON.stringify(this.searchStudents))).subscribe((data)=>{
          this.books = data;
        })
      }
    }
    
    
  }

  checkRoute(){
    this.studentService.payFees(JSON.parse(JSON.stringify(this.searchStudents))).subscribe(()=>{
      this.router.navigate(['home']);
    })
    
  }
}
