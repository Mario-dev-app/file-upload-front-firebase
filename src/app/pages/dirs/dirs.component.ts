import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadService } from '../../services/file-upload.service';
import { environment } from '../../../environments/environment.prod';
import { LoginService } from 'src/app/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { faEllipsisVertical, faFolder } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dirs',
  templateUrl: './dirs.component.html',
  styleUrls: ['./dirs.component.css']
})
export class DirsComponent implements OnInit {

  faEllipsisVertical = faEllipsisVertical;

  faFolder = faFolder;
  
  dirsName = [];

  constructor(
    private fileService: FileUploadService, 
    private router: Router,
    private loginService: LoginService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.getDirsName();
  }

  chargeFiles(dirname: string){
    this.router.navigateByUrl(`/files/${dirname}`);
  }

  getDirsName(){
    this.spinner.show(),
    this.fileService.getDirsName().subscribe((data: any) => {
      this.spinner.hide();
      this.dirsName = data.dirs;
    });
  }

  searchSpecificDir(event: any){
    if(event.target.value.length <= 0){
      this.getDirsName();
      return;
    }

    this.fileService.searchSpecificDir(event.target.value.trim()).subscribe((data: any) => {
      this.dirsName = data.dir;
    });
  }

  descargarCarpeta(dni: string){
    let url = `${environment.BASE_URL}/download-dir/${dni}?token=${this.loginService.token}`;
    window.open(url, "_blank");
  }

}
