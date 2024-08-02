import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { faCoffee ,faFile, faCloud, faUser, faPaperclip, faGear, faPowerOff } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faCoffee = faCoffee;
  faFile = faFile;
  faCloud = faCloud;
  faUser = faUser;
  faPaperclip = faPaperclip;
  faGear = faGear;
  faPowerOff = faPowerOff;

  constructor(public loginService: LoginService) { }

  ngOnInit(): void {
  }

  logout(){
    this.loginService.logout();
  }

  selectIcon(icon: string) {
    switch(icon){
      case 'faFile':
        return faFile;
      case 'faCloud':
        return faCloud;
      case 'faUser':
        return faUser;
      case 'faPaperclip':
        return faPaperclip;
      case 'faGear':
        return faGear;
      default:
        return faCoffee;
    }
  }
}
