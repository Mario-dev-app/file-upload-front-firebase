import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class PostulanteService {

  alertaMostrada: boolean = false;

  constructor(private http: HttpClient, private loginService: LoginService) { }

  /* OBTENGO USUARIOS CON ROL POSTULANTE */
  obtenerPostulantes(){
    return this.http.get(`${environment.BASE_URL}/users/postulantes?token=${this.loginService.token}`);
  }

  crearPostulante(body: any){
    return this.http.post(`${environment.BASE_URL}/postulante?token=${this.loginService.token}`, body);
  }

  buscarPostulantePorFiltro(search: string){
    return this.http.get(`${environment.BASE_URL}/user/search?search=${search}&token=${this.loginService.token}`);
  }

  buscarPostulantePorId(id: string){
    return this.http.get(`${environment.BASE_URL}/postulante/${id}?token=${this.loginService.token}`);
  }

  modificarPostulante(body: any){
    return this.http.put(`${environment.BASE_URL}/postulante/${body.id}?token=${this.loginService.token}`, body);
  }
  
  obtenerAvance(id: string) {
    return this.http.get(`${environment.BASE_URL}/nuevo-ingreso/avance/${id}?token=${this.loginService.token}`);
  }
  
  enviarRecordatorio(id: string) {
    return this.http.get(`${environment.BASE_URL}/nuevo-ingreso/recordatorio/${id}?token=${this.loginService.token}`);
  }

  habilitarReenvio(id: string, nombreDocumento: string) {
    return this.http.put(`${environment.BASE_URL}/habilitar-reenvio/${id}?token=${this.loginService.token}`, {nombreDocumento});
  }

  descargarReporte() {
    return `${environment.BASE_URL}/excel/nuevos-ingresos?token=${this.loginService.token}`;
  }
}
