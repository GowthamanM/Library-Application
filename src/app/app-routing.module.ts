import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { AuthGuard } from './services/auth.guard';
import { LoginPageComponent } from './login-page/login-page.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { AddBookComponent } from './add-book/add-book.component';
import { AddBookFormComponent } from './add-book-form/add-book-form.component';
import { AddStudentFormComponent } from './add-student-form/add-student-form.component';


const routes: Routes = [
  {
    path:'',
    redirectTo:'/login',
    pathMatch: 'full'
  },
  {
    path:'login',
    component:LoginPageComponent
  }
  ,
  {path:'home',component:HomeComponent},
  {path:'addStudent',component:AddStudentComponent},
  {path:'addBook',component:AddBookComponent},
  {path:'addBookForm',component:AddBookFormComponent},
  {path:'addStudentForm',component:AddStudentFormComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
