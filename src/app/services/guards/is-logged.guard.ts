import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router
    ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(this.loginService.isLogged){
        if(this.loginService.user.role == 'admin'){
          this.router.navigateByUrl('/dirs');
        }else{
          this.router.navigateByUrl('/upload');
        }
        return false;
      }else{
        return true;
      }
  }

}
