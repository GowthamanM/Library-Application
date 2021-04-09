import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { AddStudentComponent } from './add-student/add-student.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogDetailComponent } from './home/log-detail/log-detail.component';
import {HttpClientModule} from '@angular/common/http';
import { AddBookComponent } from './add-book/add-book.component';
import { AddBookFormComponent } from './add-book-form/add-book-form.component';
import { AddStudentFormComponent } from './add-student-form/add-student-form.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  declarations: [
    AppComponent,
    LoginPageComponent,
    HomeComponent,
    NavbarComponent,
    AddStudentComponent,
    LogDetailComponent,
    AddBookComponent,
    AddBookFormComponent,
    AddStudentFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
