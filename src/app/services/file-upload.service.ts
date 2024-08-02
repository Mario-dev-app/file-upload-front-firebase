import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  getDirsName(){
    return this.http.get(`${environment.BASE_URL}/dirs-name?token=${this.loginService.token}`);
  }

  getFilesName(dirname: string){
    return this.http.get(`${environment.BASE_URL}/files?dirname=${dirname}&token=${this.loginService.token}`);
  }

  getSrcPostulante(){
    return this.http.get(`${environment.BASE_URL}/recursos-postulante?token=${this.loginService.token}&dni=${this.loginService.user.username}`);
  }
  
  getSrcRrhh(){
    return this.http.get(`${environment.BASE_URL}/src-postulante?token=${this.loginService.token}`);
  }

  uploadSrcPostulante(file: File){
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${environment.BASE_URL}/src-postulante?token=${this.loginService.token}`, formData);
  }

  deleteSrcPostulante(fileName: string){
    return this.http.delete(`${environment.BASE_URL}/src-postulante?token=${this.loginService.token}&nombreArchivo=${fileName}`);
  }

  uploadFile(file: File, tipoArchivo: string){
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${environment.BASE_URL}/upload/${this.loginService.user.username}?token=${this.loginService.token}&tipoArchivo=${tipoArchivo}`, formData);
  }

  searchSpecificDir(search: string){
    return this.http.get(`${environment.BASE_URL}/specific-dir?search=${search}&token=${this.loginService.token}`);
  }

}
