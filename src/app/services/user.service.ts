import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  modificarUsuario(body: any, userId: string){
    return this.http.put(`${environment.BASE_URL}/user/${userId}?token=${this.loginService.token}`, body);
  }

  modificarEstadoUsuario(body: any, userId: string){
    return this.http.put(`${environment.BASE_URL}/user-state/${userId}?token=${this.loginService.token}`, body);
  }
  
  enviarCorreoCredenciales(userId: string, dni: string) { 
    return this.http.post(`${environment.BASE_URL}/user/correo-cred/${userId}?token=${this.loginService.token}`, {dni});
  }
}
