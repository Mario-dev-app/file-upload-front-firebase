import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { environment } from '../../../environments/environment.prod';
import { LoginService } from 'src/app/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-src-rrhh',
  templateUrl: './src-rrhh.component.html',
  styleUrls: ['./src-rrhh.component.css']
})
export class SrcRrhhComponent implements OnInit {

  srcPostulante: any[] = [];

  @ViewChild('inputFile') inputFile?: ElementRef;

  constructor(
    private fileUploadService: FileUploadService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.cargarRecursos();
  }

  showInfoSimpleAlert(text: string){
    Swal.fire({
        text: text,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'black'
      });
  }

  showSuccessSimpleMessage(text: string){
    Swal.fire({
        text: text,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'black'
      });
  }

  showErrorSimpleMessage(text: string){
    Swal.fire({
        text: text,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'black'
      });
  }

  abrirExplorador(){
    this.inputFile?.nativeElement.click();
  }

  cargarRecursos(){
    this.spinner.show();
    this.fileUploadService.getSrcRrhh().subscribe((resp: any) => {
      this.srcPostulante = resp.files;
      this.spinner.hide();
    });
  }

  subirRecursos(event: any){
    let todoSubido = true;
    this.spinner.show();
    let filesForUpload = event.target.files;
    for (let i = 0; i < filesForUpload.length; i++) {
      this.fileUploadService.uploadSrcPostulante(filesForUpload[i]).subscribe((resp) => {
        console.log(resp);
      }, (err) => {
        todoSubido = false;
        console.log(err);
      });
    }
    this.spinner.hide();
    if(todoSubido){
      this.showSuccessSimpleMessage('Recursos subidos correctae')
    }else{
      this.showInfoSimpleAlert('Hubo un error con alguno de los archivos a subir');
    }
    this.cargarRecursos();
  }

  downloadFile(filename: string){
    let url = `${environment.BASE_URL}/download-src-postulante/${filename}?&token=${this.loginService.token}`;
    window.open(url, "_blank");
  }

  deleteFile(fileName: string){
    this.fileUploadService.deleteSrcPostulante(fileName).subscribe((resp: any) => {
      this.showSuccessSimpleMessage(resp.message);
      this.cargarRecursos();
    }, (err) => {
      this.showErrorSimpleMessage(err.error.message);
    });
  }

}
