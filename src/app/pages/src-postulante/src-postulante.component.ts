import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { environment } from '../../../environments/environment';
import { LoginService } from 'src/app/services/login.service';
import { faFile } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-src-postulante',
  templateUrl: './src-postulante.component.html',
  styleUrls: ['./src-postulante.component.css']
})
export class SrcPostulanteComponent implements OnInit {

  faFile = faFile;

  srcPostulante: any[] = [];

  constructor(
    private fileUploadService: FileUploadService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.cargarRecursos();
  }

  cargarRecursos(){
    this.spinner.show();
    this.fileUploadService.getSrcPostulante().subscribe((resp: any) => {
      this.srcPostulante = resp.recursos.recursos;
      this.spinner.hide();
    });
  }

  downloadFile(filename: string){
    let url = `${environment.BASE_URL}/download-src-postulante/${filename}?&token=${this.loginService.token}`;
    window.open(url, "_blank");
  }

}
