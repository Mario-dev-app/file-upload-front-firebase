import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private loginService: LoginService, private router: Router){}

  title = 'front';

  ngOnInit(): void {
    if(localStorage.getItem('token') && localStorage.getItem('user') && localStorage.getItem('menu')){
      this.loginService.menu = JSON.parse(localStorage.getItem('menu') || '');
      this.loginService.user = JSON.parse(localStorage.getItem('user') || '');
      this.loginService.token = localStorage.getItem('token') || '';
      this.loginService.isLogged = true;
      this.router.navigateByUrl('/dirs');
    }
  }
}
