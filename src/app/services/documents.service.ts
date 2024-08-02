import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getDocuments(){
    return this.http.get(`${environment.BASE_URL}/docs?token=${this.loginService.token}`);
  }
  
  createNewDocument(nombreLargo: string){
    return this.http.post(`${environment.BASE_URL}/docs?token=${this.loginService.token}`, {nombreLargo});
  }
  
  actualizarDocumento(id: string, nombreLargo: string){
    return this.http.put(`${environment.BASE_URL}/doc/${id}?token=${this.loginService.token}`, {nombreLargo});
  }
  
  eliminarDocumento(id: string){
    return this.http.delete(`${environment.BASE_URL}/doc/${id}?token=${this.loginService.token}`);
  }
}
