import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { LoginPageComponent } from "../login-page/login-page.component";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  status: boolean = false;

  constructor(private router :Router,private login:LoginPageComponent) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    router: RouterStateSnapshot
  ): 
  boolean {
    if(this.isloggedIn()){
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }

  public isloggedIn(){
    let status = false;
    // if(this.login.validateUser()){
    //   status=true;
    // }
    // else{
    //   status=false;
    // }
    return status;
  }

}


// canActivate(
//   route: ActivatedRouteSnapshot, 
//   router: RouterStateSnapshot
// ): boolean | Promise<boolean> | Observable<boolean> {
//     return this.loginServices.loginStatus;
// }