import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FileUploadService } from '../../services/file-upload.service';
import { PostulanteService } from 'src/app/services/postulante.service';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  files: File[] = [];

  error: boolean = false;

  nombreArchivosError = '';

  @ViewChild('inputFile') inputFile!: ElementRef;

  cvLoading: boolean = false;
  cerificadoTrabajosLoading: boolean = false;
  certificadoEstudiosLoading: boolean = false;
  dniEscaneadoLoading: boolean = false;
  reciboServiciosLoading: boolean = false;
  dniHijosLoading: boolean = false;
  dniConvivienteLoading: boolean = false;
  partidaMatrimonioLoading: boolean = false;
  fotoLoading: boolean = false;
  rentaQuintaLoading: boolean = false;
  numeroCuentaLoading: boolean = false;

  datosPostulante: any = [];

  documentosPostulante: any[] = [];

  constructor(
    private filesService: FileUploadService,
    private postulanteService: PostulanteService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.cargarDatosPostulante();
    if(!this.postulanteService.alertaMostrada) {
      Swal.fire({
        html: "<h1>IMPORTANTE!</h1><br> <p style='text-align: justify'>Todos los documentos deben ser firmados a mano con lapicero azul y no pegar su firma. Es muy importante revisar el formato de CV adjunto, completarlo con su información y adjuntar todos sus certificados de estudios y trabajo. Además, considerar que la plataforma estará disponible para subir documentación de <b>Lunes a Viernes de 8:00 A.M. a 6:00 P.M.</b></p>",
        timer: 7000,
        timerProgressBar: true,
        imageUrl: '../../assets/danger.png',
        imageWidth: 100,
        color: '#FFFFFF',
        background: '#002343',
        showConfirmButton: false
      });
      this.postulanteService.alertaMostrada = true;
    }
  }

  showSimpleErrorAlert(text: string) {
    Swal.fire({
      text: text,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'black'
    });
  }

  showSimpleSuccessAlert(text: string) {
    Swal.fire({
      text: text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'black'
    });
  }

  cargarDatosPostulante(){
    this.postulanteService.buscarPostulantePorFiltro(this.loginService.user['username']).subscribe((data: any) => {
      this.documentosPostulante = data.postulante[0].postulanteId.documentos;
      this.datosPostulante = data.postulante[0].postulanteId;
    });
  }

  uploadDoc(event: any, nombreDocumento: string){
    this.spinner.show();
    let file = event.target.files[0];
    let blob = file.slice(0, file.size, file.type);
    let newFile;
    console.log(file.type);
    if(file.type === 'application/pdf'){
      newFile = new File([blob], `${nombreDocumento}.pdf`, {type: file.type});
    }else if(file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
      newFile = new File([blob], `${nombreDocumento}.docx`, {type: file.type});
    }
    else if(file.type === 'image/jpeg'){
      newFile = new File([blob], `${nombreDocumento}.jpg`, {type: file.type});
    }
    else{
      newFile = new File([blob], `${nombreDocumento}.pdf`, {type: file.type});
    }
    this.filesService.uploadFile(newFile, nombreDocumento).subscribe((resp: any) => {
      console.log(resp);
      if(!resp.ok){
        this.spinner.hide();
        this.showSimpleErrorAlert(resp.err.message);
      }else{
        if(resp.archivosCompletos){
          this.spinner.hide();
          this.userService.modificarEstadoUsuario({ active: false }, this.loginService.user._id).subscribe((resp: any) => {
            console.log(resp);
            Swal.fire({
              icon: 'info',
              title: '¡Gracias!',
              text: "Se completó la subida de su documentación. Pronto nos pondremos en contacto con usted.",
              confirmButtonText: "Aceptar",
              confirmButtonColor: 'black'
            }).then((result) => {
              if (result.isConfirmed) {
                this.loginService.logout();
              }
            });
          });
        }else{
          this.spinner.hide();
          this.showSimpleSuccessAlert(`Se subió correctamente el archivo ${event.target.files[0].name}`);
          this.cargarDatosPostulante();
        }
      }
    }, (err) => {
      this.spinner.hide();
      this.showSimpleErrorAlert(err.message);
    });
  }

  filesChange(event: any){
    this.files.push(...event.target.files);
    event.target.value = null;
  }

  removeFile(index: number){
    this.files.splice(index, 1);
  }


}
