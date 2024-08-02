import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentsService } from '../../services/documents.service';
import { FileUploadService } from '../../services/file-upload.service';
import { PostulanteService } from '../../services/postulante.service';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { PerfilesService } from 'src/app/services/perfiles.service';
import { faFileExcel, faPlus, faPen, faListCheck, faEnvelope, faXmark, faCheck, faX } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  faFileExcel = faFileExcel;
  faPlus = faPlus;
  faPen = faPen;
  faListCheck = faListCheck;
  faEnvelope = faEnvelope;
  faXmark = faXmark;
  faCheck = faCheck;
  faX = faX;

  @ViewChild('closeModal') closeModal?: ElementRef;

  @ViewChild('closeModal2') closeModal2?: ElementRef;

  @ViewChild('closeModalUpdate') closeModalUpdate?: ElementRef;

  @ViewChild('inputFile') inputFile?: ElementRef;

  @ViewChild('inputFileToUpdate') inputFileToUpdate?: ElementRef;

  recursosToUpload: any[] = [];

  recursosToUpdate: any[] = [];

  documentos: any[] = [];

  todosLosDocumentos: any[] = [];

  nuevoPostulanteForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    apellidos: new FormControl('', [Validators.required, Validators.minLength(8)]),
    puesto: new FormControl('', [Validators.required, Validators.minLength(8)]),
    dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    correo: new FormControl('', [Validators.email, Validators.required]),
    perfil: new FormControl(''),
    subperfil: new FormControl('')
  });

  actualizarPostulanteForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    apellidos: new FormControl('', [Validators.required, Validators.minLength(8)]),
    puesto: new FormControl('', [Validators.required, Validators.minLength(8)]),
    dni: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]),
    correo: new FormControl('', [Validators.email, Validators.required]),
  });

  postulantes: any = [];

  avanceDocumentos: any = [];

  postulanteActualizado: any;

  idUsuarioSeleccionado: string = '';

  idNuevoIngresoSeleccionado: string = '';

  recursosPersonalizados: boolean = false;

  perfiles: any[] = [];

  subperfilPlanilla?: boolean;
  subperfilPracticante?: boolean;

  constructor(
    private postulanteService: PostulanteService,
    private fileUploadService: FileUploadService,
    private spinner: NgxSpinnerService,
    private docsService: DocumentsService,
    private userService: UserService,
    private perfilesService: PerfilesService
  ) { }

  ngOnInit(): void {
    this.cargarPostulantes();
    this.obtenerPerfiles();
  }

  validateOnlyNumbers(event: any) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
    if (!regex.test(key)) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  }

  cambiarRecursoPersonalizado() {
    this.recursosPersonalizados = !this.recursosPersonalizados;
  }

  obtenerPerfiles() {
    this.perfilesService.obtenerPerfiles().subscribe((resp: any) => {
      this.perfiles = resp.result;
    }, (err) => {
      console.log(err);
    })
  }


  cargarPostulantes() {
    this.spinner.show();
    this.postulanteService.obtenerPostulantes().subscribe((resp: any) => {
      this.spinner.hide();
      this.postulantes = resp.result;
    });
  }

  showSimpleInfoAlert(text: string) {
    Swal.fire({
      text: text,
      icon: 'info',
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

  showSimpleSuccessAlert(text: string) {
    Swal.fire({
      text: text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: 'black'
    });
  }

  limpiarFormulario() {
    this.nuevoPostulanteForm.controls['nombre'].setValue('');
    this.nuevoPostulanteForm.controls['apellidos'].setValue('');
    this.nuevoPostulanteForm.controls['puesto'].setValue('');
    this.nuevoPostulanteForm.controls['dni'].setValue('');
    this.nuevoPostulanteForm.controls['correo'].setValue('');
  }

  limpiarFormularioToUpdate() {
    Object.keys(this.actualizarPostulanteForm.controls).forEach((key) => {
      this.actualizarPostulanteForm.get(key)?.setValue('');
    });
  }

  crearNuevoPostulante() {
    this.spinner.show();
    if (!this.nuevoPostulanteForm.valid) {
      this.showSimpleInfoAlert('Rellene correctamente los datos del formulario');
      this.spinner.hide();
      return;
    }


    let nombre = this.nuevoPostulanteForm.controls['nombre'].value!.trim();
    let apellidos = this.nuevoPostulanteForm.controls['apellidos'].value!.trim();
    let puesto = this.nuevoPostulanteForm.controls['puesto'].value!.trim();
    let dni = this.nuevoPostulanteForm.controls['dni'].value!.trim();
    let correo = this.nuevoPostulanteForm.controls['correo'].value!.trim();

    let documentos: any[] = [];

      Object.keys(this.nuevoPostulanteForm.controls).forEach(key => {
        if (key.toString() !== 'nombre' && key.toString() !== 'apellidos' && key.toString() !== 'puesto' && key.toString() !== 'dni' && key.toString() !== 'correo') {
          if (this.nuevoPostulanteForm.get(key)?.value === true) {
            documentos.push({ activo: this.nuevoPostulanteForm.get(key)?.value, nombreDocumento: `${key}`, nombreArchivo: '' });
          }
        }
      });

    if (!this.recursosPersonalizados) {
      let perfil = this.nuevoPostulanteForm.controls['perfil'].value;
      let subperfil = this.nuevoPostulanteForm.controls['subperfil'].value;

      if(perfil?.trim().length === 0) {
        this.showSimpleInfoAlert('No ha seleccionado ningún perfil');
        this.spinner.hide();
        return;
      }

      if(subperfil?.trim().length === 0) {
        this.showSimpleInfoAlert('No ha seleccionado ningún subperfil');
        this.spinner.hide();
        return;
      }

      let body = {
        nombre,
        apellidos,
        puesto,
        dni,
        correo,
        documentos,
        subperfil,
        perfil
      };

      this.spinner.hide();
      this.postulanteService.crearPostulante(body).subscribe((resp:any) => {
        this.showSimpleSuccessAlert(resp.message);
        this.closeModal?.nativeElement.click();
        this.limpiarFormulario();
        this.cargarPostulantes();
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.showSimpleInfoAlert(err.error.message);
      });
    } else {

      /* RECURSOS PERSONALIZADOS */
      let recursos = [];
      for (let i = 0; i < this.recursosToUpload.length; i++) {
        recursos.push(this.recursosToUpload[i].name);
        this.fileUploadService.uploadSrcPostulante(this.recursosToUpload[i]).subscribe((resp: any) => {
          console.log(resp);
        });
      }

      let body = {
        nombre,
        apellidos,
        puesto,
        dni,
        correo,
        documentos,
        recursos
      };

      this.postulanteService.crearPostulante(body).subscribe((resp: any) => {
        this.showSimpleSuccessAlert(resp.message);
        this.closeModal?.nativeElement.click();
        this.limpiarFormulario();
        this.cargarPostulantes();
        this.spinner.hide();
      }, (err) => {
        this.spinner.hide();
        this.showSimpleInfoAlert(err.error.message);
      });
    }



  }

  buscarPostulante(event: any) {
    if (event.target.value.length <= 0) {
      this.cargarPostulantes();
      return;
    }

    this.postulanteService.buscarPostulantePorFiltro(event.target.value.trim()).subscribe((data: any) => {
      this.postulantes = data.postulante;
    });
  }

  setDatosPostulante(postulante: any) {
    this.postulanteService.buscarPostulantePorId(postulante._id).subscribe((postulanteActualizado: any) => {
      this.postulanteActualizado = postulanteActualizado.postulante;
      this.recursosToUpload = [];
      this.recursosToUpdate = [];
      this.limpiarFormularioToUpdate();

      this.docsService.getDocuments().subscribe((resp: any) => {
        this.todosLosDocumentos = resp.documentos;
        this.todosLosDocumentos.forEach((doc: any) => {
          this.actualizarPostulanteForm.addControl(doc.nombreCorto, new FormControl(''));
        });

        postulante.documentos.forEach((doc: any) => {
          Object.keys(this.actualizarPostulanteForm.controls).forEach((key) => {
            if (key.toString() === doc.nombreDocumento) {
              this.actualizarPostulanteForm.get(key)?.setValue(doc.activo);
            }
          });
        });

      });

      this.actualizarPostulanteForm.controls['id'].setValue(postulante._id);
      this.actualizarPostulanteForm.controls['nombre'].setValue(postulante.nombre);
      this.actualizarPostulanteForm.controls['apellidos'].setValue(postulante.apellidos);
      this.actualizarPostulanteForm.controls['puesto'].setValue(postulante.puesto);
      this.actualizarPostulanteForm.controls['dni'].setValue(postulante.dni);
      this.actualizarPostulanteForm.controls['correo'].setValue(postulante.correo);

      postulante.recursos.forEach((recurso: any) => {
        this.recursosToUpload.push({ name: recurso, nuevo: false });
      });
      this.recursosToUpload = postulante.recursos;
    });
  }

  actualizarPostulante() {
    this.spinner.show();
    if (!this.actualizarPostulanteForm.valid) {
      this.showSimpleInfoAlert('Rellene correctamente los datos del formulario');
      this.spinner.hide();
      return;
    }

    let id = this.actualizarPostulanteForm.controls['id'].value!.trim();
    let nombre = this.actualizarPostulanteForm.controls['nombre'].value!.trim();
    let apellidos = this.actualizarPostulanteForm.controls['apellidos'].value!.trim();
    let puesto = this.actualizarPostulanteForm.controls['puesto'].value!.trim();
    let dni = this.actualizarPostulanteForm.controls['dni'].value!.trim();
    let correo = this.actualizarPostulanteForm.controls['correo'].value!.trim();
    let recursos = this.recursosToUpload;

    let documentos: any[] = [];

    Object.keys(this.actualizarPostulanteForm.controls).forEach(key => {
      if (key.toString() !== 'id' && key.toString() !== 'nombre' && key.toString() !== 'apellidos' && key.toString() !== 'puesto' && key.toString() !== 'dni' && key.toString() !== 'correo') {
        documentos.push({ activo: this.actualizarPostulanteForm.get(key)?.value === true ? true : false, nombreDocumento: `${key}`, nombreArchivo: '' });
      }
    });

    this.postulanteActualizado.documentos.forEach((doc: any) => {
      if (doc.nombreArchivo.length !== 0) {
        documentos.find((newDoc) => {
          if (newDoc.nombreDocumento === doc.nombreDocumento) {
            newDoc.nombreArchivo = doc.nombreArchivo;
          }
        });
      }
    });

    documentos = documentos.filter((doc) => {
      if (doc.activo !== false) {
        return doc;
      }
    });

    if (this.recursosToUpdate.length !== 0) {
      this.recursosToUpdate.forEach((file) => {
        this.fileUploadService.uploadSrcPostulante(file).subscribe((data: any) => {
          console.log(data);
        })
      });
    }

    let body = { id, nombre, apellidos, puesto, dni, correo, documentos, recursos };
    this.postulanteService.modificarPostulante(body).subscribe((data: any) => {
      this.showSimpleSuccessAlert(data.message);
      this.closeModalUpdate?.nativeElement.click();
      this.cargarPostulantes();
      this.spinner.hide();
    }, (err) => {
      this.spinner.hide();
      this.showSimpleInfoAlert(err.error.message);
    });

  }

  whenOpenModalToCreate() {
    this.recursosToUpload = [];

    this.docsService.getDocuments().subscribe((resp: any) => {
      this.documentos = resp.documentos;
      this.documentos.forEach((doc) => {
        this.nuevoPostulanteForm.addControl(doc.nombreCorto, new FormControl(true));
      });
    });
    /* this.testForm.addControl('nuevo', new FormControl('', [Validators.required]));
    console.log(this.testForm.controls); */
  }


  abrirExplorador() {
    this.inputFile!.nativeElement.value = '';
    this.inputFile?.nativeElement.click();
  }

  abrirExploradorToUpdate() {
    this.inputFileToUpdate!.nativeElement.value = '';
    this.inputFileToUpdate?.nativeElement.click();
  }

  cargarArchivos(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.recursosToUpload.push(event.target.files[i]);
    }
  }

  cargarArchivosToUpdate(event: any) {
    for (let i = 0; i < event.target.files.length; i++) {
      this.recursosToUpdate.push(event.target.files[i]);
      this.recursosToUpload.push(event.target.files[i].name);
    }
  }

  removerArchivo(i: number) {
    this.recursosToUpload.splice(i, 1);
  }

  removerArchivoToUpload(i: number) {
    this.recursosToUpload.splice(i, 1);
  }

  cambiarEstadoPostulante(event: any, postulante: any) {
    Swal.fire({
      text: `¿Estás seguro de cambiar el estado del usuario ${postulante.postulanteId.nombre} ${postulante.postulanteId.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'black',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.userService.modificarUsuario({ active: event.target.checked }, postulante._id).subscribe((resp: any) => {
          this.spinner.hide();
          this.showSimpleSuccessAlert('Se modificó correctamente el estado');
          this.cargarPostulantes();
        }, (err) => {
          this.spinner.hide();
          this.showSimpleErrorAlert(err.message);
        });
      } else {
        this.spinner.hide();
        this.cargarPostulantes();
      }
    })
  }


  getAvance(idNuevoIngreso: string, idUsuarioNuevoIngreso: string) {
    this.postulanteService.obtenerAvance(idNuevoIngreso).subscribe((resp: any) => {
      if (!resp.ok) {
        this.showSimpleErrorAlert(resp.message);
        return;
      }
      this.avanceDocumentos = resp.nuevoIngreso.documentos;
      this.idUsuarioSeleccionado = idUsuarioNuevoIngreso;
      this.idNuevoIngresoSeleccionado = resp.nuevoIngreso._id;
    }, (err) => {
      this.showSimpleErrorAlert(err.message);
    });
  }

  enviarRecordatorio() {
    this.spinner.show();
    let idUsuario = this.idUsuarioSeleccionado;
    if (idUsuario.length === 0) {
      this.showSimpleInfoAlert('El ID de usuario seleccionado no es válido');
      this.spinner.hide();
      return;
    }

    this.postulanteService.enviarRecordatorio(idUsuario).subscribe((resp: any) => {
      if (!resp.ok) {
        this.showSimpleErrorAlert(resp.message);
        this.spinner.hide();
        return;
      }

      this.spinner.hide();
      this.showSimpleSuccessAlert(resp.message);
    }, (err) => {
      this.spinner.hide();
      this.showSimpleErrorAlert(err.message);
    });
  }

  enviarCredenciales(id: string, dni: string) {
    this.spinner.show()
    if (id.length === 0 || dni.length === 0) {
      this.spinner.hide();
      this.showSimpleInfoAlert('El ID del usuario seleccionado no es válido');
      return;
    }

    this.userService.enviarCorreoCredenciales(id, dni).subscribe((resp: any) => {
      if (!resp.ok) {
        this.showSimpleErrorAlert(resp.message);
        this.spinner.hide();
        return;
      }

      this.spinner.hide();
      this.showSimpleSuccessAlert(resp.message);
    }, (err) => {
      this.spinner.hide();
      this.showSimpleErrorAlert(err.message);
    });
  }

  habilitarReenvio(nombreDocumento: string) {
    this.spinner.show();
    this.postulanteService.habilitarReenvio(this.idNuevoIngresoSeleccionado, nombreDocumento).subscribe((resp: any) => {
      if(!resp.ok) {
        this.spinner.hide();
        this.showSimpleInfoAlert(resp.message);
        return;
      }
      
      this.spinner.hide();
      this.getAvance(this.idNuevoIngresoSeleccionado, this.idUsuarioSeleccionado);
      this.showSimpleSuccessAlert('Se habilitó el reenvío del documento seleccionado');
    }, (err) => {
      this.spinner.hide();
      this.showSimpleErrorAlert(err.message);
    });
  }

  descargarReporte() {
    window.open(this.postulanteService.descargarReporte(), '_blank');
  }

}
