import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AddStudentComponent } from '../add-student/add-student.component';
import { Student } from '../models/student';
import { StudentService } from '../services/student.service';

@Component({
  selector: 'app-add-student-form',
  templateUrl: './add-student-form.component.html',
  styleUrls: ['./add-student-form.component.css']
})
export class AddStudentFormComponent implements OnInit {
  temp:any;
  userFound:any=false;
  database:any;
  flag:any=false;
  studentData:Student=new Student();
  constructor(private student:StudentService,public router:Router) { 
    this.student.getStudents().subscribe((data)=>{
      this.database = data;
      this.temp = JSON.parse(JSON.stringify(this.database));
    });
    
  }
  
  ngOnInit(): void {
  }
  addStudent(){
    console.log(this.database);
    console.log(this.studentData.email);
    this.temp = this.database.filter((data:any)=> (data.email === this.studentData.email));
    if(this.temp.length === 1){
      this.userFound = true;
    }else{
      this.userFound = false;
      this.studentData.books=0;
      this.studentData.total_amount=0;
      this.studentData.due_amount=0;
      this.studentData.status = 1;
      this.student.saveStudent(this.studentData).subscribe(()=>{
        this.router.navigateByUrl("/addStudent");
      });
    }
    
  }
}
