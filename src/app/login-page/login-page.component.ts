import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  errorMessage:any='';
  passwordInput:any="";
  emailInput:any="";
  status:boolean=true;
  constructor(private router:Router) { }

  ngOnInit(): void {
  }

    validateUser(){
      console.log('working');
      
      if(this.emailInput==="admin" && this.passwordInput==="admin123"){
        this.router.navigate(['home']);  
      }else{
        this.status=false;
      }
    }
}
