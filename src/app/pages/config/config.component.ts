import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentsService } from '../../services/documents.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;

  @ViewChild('closeModal') closeModal?: ElementRef;
  @ViewChild('closeUpdateModal') closeUpdateModal?: ElementRef;

  documentos: any[] = [];

  tempUser: any;

  tempUserForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required])
  });

  constructor(
    private docsService: DocumentsService, 
    private loginService: LoginService,
    private userService: UserService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.obtenerDocumentos();
    this.setDatosUsuario();
  }

  setDatosUsuario(){
    this.tempUserForm.controls['id'].setValue(this.loginService.user._id);
    this.tempUserForm.controls['username'].setValue(this.loginService.user.username);
    this.tempUserForm.controls['correo'].setValue(this.loginService.user.correo);
    this.tempUserForm.controls['role'].setValue(this.loginService.user.role);
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

  nuevoDocuentoForm = new FormGroup({
    nombreDoc: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  actualizarDocumentoForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    nombreLargo: new FormControl('', [Validators.required, Validators.minLength(2)])
  });

  obtenerDocumentos(){
    this.spinner.show();
    this.docsService.getDocuments().subscribe((resp: any) => {
      this.spinner.hide();
      this.documentos = resp.documentos;
    }, (err) => {
      this.spinner.hide();
      this.showSimpleErrorAlert(err.message);
    });
  }

  guardarDoc(){
    this.spinner.show();
    if(!this.nuevoDocuentoForm.valid){
      this.spinner.hide();
      this.showSimpleInfoAlert('Ingrese un nombre de documento válido');
      return;
    }
    
    let nombreDoc = this.nuevoDocuentoForm.controls['nombreDoc'].value?.trim();
    this.docsService.createNewDocument(nombreDoc!).subscribe((resp: any) => {
      if(!resp.ok){
        this.spinner.hide();
        this.closeModal?.nativeElement.click();
        this.showSimpleInfoAlert(resp.message);
      }else{
        this.spinner.hide();
        this.closeModal?.nativeElement.click();
        this.showSimpleSuccessAlert(resp.message);
        this.obtenerDocumentos();
        this.nuevoDocuentoForm.controls['nombreDoc'].setValue('');
      }
    }, (err) => {
      this.spinner.hide();
      this.closeModal?.nativeElement.click();
      this.showSimpleErrorAlert(err.message);
    });
  }

  setDocumentoData(doc: any){
    this.actualizarDocumentoForm.controls['id'].setValue(doc._id);
    this.actualizarDocumentoForm.controls['nombreLargo'].setValue(doc.nombreLargo);
  }

  actualizarDocumento(){
    this.spinner.show();
    if(!this.actualizarDocumentoForm.valid){
      this.spinner.hide();
      this.showSimpleInfoAlert('Ingrese un nombre de documento válido');
      return;
    }
    
    let id = this.actualizarDocumentoForm.controls['id'].value;
    let nombreLargo = this.actualizarDocumentoForm.controls['nombreLargo'].value?.trim();
    
    this.docsService.actualizarDocumento(id!, nombreLargo!).subscribe((resp: any) => {
      if(!resp.ok){
        this.spinner.hide();
        this.closeUpdateModal?.nativeElement.click();
        this.showSimpleInfoAlert(resp.message);
      }else{
        this.spinner.hide();
        this.closeUpdateModal?.nativeElement.click();
        this.showSimpleSuccessAlert(resp.message);
        this.obtenerDocumentos();
        this.actualizarDocumentoForm.controls['nombreLargo'].setValue('');
        this.actualizarDocumentoForm.controls['id'].setValue('');
      }
    }, (err) => {
      this.spinner.hide();
      this.closeUpdateModal?.nativeElement.click();
      this.showSimpleErrorAlert(err.message);
    });
  }

  eliminarDocumento(id: string){
    Swal.fire({
      text: `¿Estás seguro de eliminar ese documento?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'black',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.docsService.eliminarDocumento(id).subscribe((resp: any) => {
          this.spinner.hide();
          this.showSimpleSuccessAlert(resp.message);
          this.obtenerDocumentos();
        }, (err) => {
          this.spinner.hide();
          this.showSimpleErrorAlert(err.message);
        });
      }
    })
  }


  actualizarUsuario(){
    this.spinner.show();
    if(!this.tempUserForm.valid){
      this.spinner.hide();
      this.showSimpleInfoAlert('Ingrese una dirección de correo válida');
      return;
    }
    
    let id = this.tempUserForm.controls['id'].value;
    let correo = this.tempUserForm.controls['correo'].value?.trim();
    
    this.userService.modificarUsuario({correo}, id!).subscribe((resp: any) => {
      if(!resp.ok){
        this.spinner.hide();
        this.showSimpleErrorAlert(resp.message);
      }else{
        this.spinner.hide();
        this.loginService.user.correo = correo;
        let temp = JSON.parse(localStorage.getItem('user') || '');
        temp.correo = correo;
        localStorage.setItem('user', JSON.stringify(temp));
        this.showSimpleSuccessAlert('Correo actualizado correctamente');
      }
    },(err) => {
      this.spinner.hide();
      this.showSimpleErrorAlert(err.message);
    });
  }
}
