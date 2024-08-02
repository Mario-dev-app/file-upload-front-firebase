import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { LoginService } from '../services/login.service';
import { PostulanteService } from '../services/postulante.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /* showPassword: boolean = false; */

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    showPassword: new FormControl(false)
  });

  constructor(
    private loginService: LoginService, 
    private router: Router, 
    private spinner: NgxSpinnerService,
    private postulanteService: PostulanteService
    ) { }

  ngOnInit(): void {
  }

  showInfoSimpleAlert(text: string){
    Swal.fire({
        text: text,
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: 'black'
      });
  }

  login(){
    this.spinner.show();
    if(!this.loginForm.valid){
      this.showInfoSimpleAlert('El formato de los datos ingresados no es correcto');
      this.spinner.hide();
      return;
    }

    let username = this.loginForm.controls['username'].value!.trim();
    let password = this.loginForm.controls['password'].value!.trim();

    this.loginService.login(username, password).subscribe((resp: any) => {
      this.loginService.isLogged = true;
      this.loginService.menu = resp.menu;
      this.loginService.token = resp.token;
      this.loginService.user = resp.user;
      localStorage.setItem('token', resp.token);
      localStorage.setItem('menu', JSON.stringify(resp.menu));
      localStorage.setItem('user', JSON.stringify(resp.user));
      if(resp.user.role == 'admin'){
        this.router.navigateByUrl('/dirs');
        this.spinner.hide();
      }else{
        this.postulanteService.alertaMostrada = false;
        this.router.navigateByUrl('/upload');
        this.spinner.hide();
      }
    }, (err) => {
      this.showInfoSimpleAlert(err.error.message);
      this.spinner.hide();
    });
  }

}
