import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminRoleGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(this.loginService.user.role !== 'admin'){
        this.router.navigateByUrl('/upload');
        return false;
      }else{
        return true;
      }
  }
  
}
