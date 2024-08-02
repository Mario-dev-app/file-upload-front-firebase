import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  isLogged: boolean = false;

  menu: any[] = [];

  token: string = '';

  user: any;

  constructor(private http: HttpClient, private router: Router) { }

  login(username: string, password: string){
    return this.http.post(`${environment.BASE_URL}/login`, {username, password});
  }

  logout(){
    localStorage.removeItem('menu');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.menu = [];
    this.token = '',
    this.user = [];
    this.isLogged = false;
    this.router.navigateByUrl('/login');
  }

  validarToken(){
    return this.http.get(`${environment.BASE_URL}/token-is-valid?token=${this.token}`);
  }

}
