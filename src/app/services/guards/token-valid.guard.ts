import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class TokenValidGuard implements CanActivate {

  constructor(
    private loginService: LoginService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(localStorage.getItem('token')){
        this.loginService.token = localStorage.getItem('token') || '';
      }

      return this.loginService.validarToken().pipe(
        map((resp: any) => {
          if(resp.ok){
            return true;
          }else{
            localStorage.clear();
            this.loginService.user = '';
            this.loginService.isLogged = false;
            this.loginService.menu = [];
            this.loginService.token = '';
            this.router.navigateByUrl('/login');
            return false;
          }
        })
      );
  }
  
}
