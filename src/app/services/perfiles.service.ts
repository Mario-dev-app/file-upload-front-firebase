import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PerfilesService {

  constructor(private loginService: LoginService, private http: HttpClient) { }

  obtenerPerfiles() {
    return this.http.get(`${environment.BASE_URL}/perfiles?token=${this.loginService.token}`);
  }
  
  crearPerfil(nombre: string) {
    return this.http.post(`${environment.BASE_URL}/perfil?token=${this.loginService.token}`, {nombre});
  }

  actualizarArchivos(idPerfil: string, tipo: string, archivos: string[]) {
    return this.http.put(`${environment.BASE_URL}/perfil-archivos?token=${this.loginService.token}`, {idPerfil, tipo, nombresArchivos: archivos});
  }
  
  actualizarNombre(id: any, nombre: any) {
    return this.http.put(`${environment.BASE_URL}/perfil-nombre/${id}?token=${this.loginService.token}`, {nombre});
  }

  eliminarPerfil(id: string) {
    return this.http.delete(`${environment.BASE_URL}/perfil/${id}?token=${this.loginService.token}`);
  }
}
