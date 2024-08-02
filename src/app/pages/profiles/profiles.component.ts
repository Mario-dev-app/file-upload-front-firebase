import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { PerfilesService } from 'src/app/services/perfiles.service';
import Swal from 'sweetalert2';
import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;

  @ViewChild('closeNuevoPerfilModal') closeNuevoPerfilModal?: ElementRef;
  @ViewChild('closeModificarPerfilModal') closeModificarPerfilModal?: ElementRef;
  @ViewChild('inputFile') inputFile?: ElementRef;

  tipoSeleccionado: string = '';
  idPerfilSeleccionado: string = '';
  archivosSelecion: string[] = [];

  constructor(
    private perfilesService: PerfilesService,
    private fileUploadService: FileUploadService,
    private spinner: NgxSpinnerService
    ) { }

  perfiles: any[] = [];

  nuevoPerfilForm = new FormGroup({
    nombrePerfil: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  modificarPerfilForm = new FormGroup({
    _id: new FormControl('', [Validators.required]),
    nombrePerfil: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  ngOnInit(): void {
    this.obtenerPerfiles();
  }
  
  obtenerPerfiles() {
    this.perfilesService.obtenerPerfiles().subscribe((resp:any) => {
      this.perfiles = resp.result;
    }, (err) => {
      console.log(err);
    })
  }

  showSimpleInfoAlert(text: string) {
    Swal.fire({
      text: text,
      icon: 'info',
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

  showSimpleErrorAlert(text: string) {
    Swal.fire({
      text: text,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'black'
    });
  }

  crearPerfil() {
    this.spinner.show();
    if(!this.nuevoPerfilForm.valid) {
      this.showSimpleInfoAlert('Ingrese un nombre de perfil válido');
      this.spinner.hide();
      return;
    };
    
    let nombre = this.nuevoPerfilForm.controls['nombrePerfil'].value!.trim();
    this.perfilesService.crearPerfil(nombre).subscribe((resp: any) => {
      if(!resp.ok) {
        this.spinner.hide();
        this.showSimpleErrorAlert(resp.message);
        return;
      }
      
      this.closeNuevoPerfilModal?.nativeElement.click();
      this.showSimpleSuccessAlert(resp.message);
      this.spinner.hide();
      this.obtenerPerfiles();
    }, (err) => {
      this.spinner.hide();
      this.showSimpleErrorAlert(err.message);
    });
  }

  modificarPerfil() {
    this.spinner.show();
    if(!this.modificarPerfilForm.valid) {
      this.showSimpleInfoAlert('Ingrese un nombre de perfil válido');
      this.spinner.hide();
      return;
    };

    let nombre = this.modificarPerfilForm.controls['nombrePerfil'].value?.trim();
    let id = this.modificarPerfilForm.controls['_id'].value;
    
    this.perfilesService.actualizarNombre(id, nombre).subscribe((resp: any) => {
    
      this.closeModificarPerfilModal?.nativeElement.click();
      this.showSimpleSuccessAlert(resp.message);
      this.spinner.hide();
      this.obtenerPerfiles();
    }, (err) => {
      this.spinner.hide();
      this.showSimpleErrorAlert(err.message);
    })
  }

  setNombrePerfilToUpdate(nombre: string, id: string){
    this.modificarPerfilForm.controls['nombrePerfil'].setValue(nombre);
    this.modificarPerfilForm.controls['_id'].setValue(id);
  }

  cargarRecurso(tipo: string, idPerfil: string, archivos: string[]) {
    this.inputFile?.nativeElement.click();
    this.tipoSeleccionado = tipo;
    this.idPerfilSeleccionado = idPerfil;
    this.archivosSelecion = archivos;
  }

  cargarArchivos (event: any) {
    if(event.target.files.length === 0) {
      this.showSimpleInfoAlert('No ha seleccionado ningún archivo');
      return;
    }

    let files = [];
    for (let i = 0; i < event.target.files.length; i++) {
      files.push(event.target.files[i]);
    }
    files.forEach((file) => {
      this.archivosSelecion.push(file.name);
      this.fileUploadService.uploadSrcPostulante(file).subscribe((resp) => {
        console.log(resp);
      }, (err) => {
        this.showSimpleErrorAlert(err.message);
      })
    });
    this.perfilesService.actualizarArchivos(this.idPerfilSeleccionado, this.tipoSeleccionado, this.archivosSelecion)
      .subscribe((resp: any) => {
       if(!resp.ok) {
        this.showSimpleErrorAlert(resp.message);
        return;
       } 

       this.obtenerPerfiles();
       this.showSimpleSuccessAlert(resp.message);
      }, (err) => {
        this.showSimpleErrorAlert(err.message);
      });

  }

  removerRecurso(archivos: string[], nombreArchivo: string, idPerfil: string, nombreSubperfil: string) {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Una vez eliminado, el archivo no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "black",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {

        let nuevosArchivos = archivos.filter((archivo) => {
          return archivo !== nombreArchivo;
        });
    
        this.perfilesService.actualizarArchivos(idPerfil, nombreSubperfil, nuevosArchivos).subscribe((resp: any) => {
          if(!resp.ok) {
            this.showSimpleErrorAlert(resp.message);
            return;
           } 
    
           this.obtenerPerfiles();
           this.showSimpleSuccessAlert(resp.message);
        }, (err) => {
          this.showSimpleErrorAlert(err.message);
        });
      }
    });
    

  }

  eliminarPerfil(id: string) {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Una vez eliminado el perfil, no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "black",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      this.spinner.show();
      if (result.isConfirmed) {
        this.perfilesService.eliminarPerfil(id).subscribe((resp: any) => {
          if(!resp.ok){
            this.spinner.hide();
            this.showSimpleInfoAlert(resp.message);
            return;
          }
          
          this.spinner.hide();
          this.obtenerPerfiles();
          this.showSimpleSuccessAlert(resp.message);
        },(err) => {
          this.spinner.hide();
          this.showSimpleErrorAlert(err.message);
        });
      }
    });
  }

}
