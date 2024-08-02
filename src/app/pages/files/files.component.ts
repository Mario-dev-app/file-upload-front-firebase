import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { FileUploadService } from '../../../app/services/file-upload.service';
import { environment } from '../../../environments/environment';
import { faArrowLeft, faFolder } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  faArrowLeft = faArrowLeft;
  faFolder = faFolder;

  dirname: any = '';

  files = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private filesService: FileUploadService,
    private loginService: LoginService
    ) {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.dirname = params.get('dirname');
    });
  }

  ngOnInit(): void {
    this.getFilesName();
  }

  getFilesName(){
    this.filesService.getFilesName(this.dirname).subscribe((data: any) => {
      this.files = data.files;
    });
  }

  downloadFile(filename: string){
    let url = `${environment.BASE_URL}/download-file/${filename}?dirname=${this.dirname}&token=${this.loginService.token}`;
    window.open(url, "_blank");
  }

}
