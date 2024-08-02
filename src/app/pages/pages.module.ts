import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { UploadComponent } from './upload/upload.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { UsersComponent } from './users/users.component';
import { DirsComponent } from './dirs/dirs.component';
import { FilesComponent } from './files/files.component';
import { SrcRrhhComponent } from './src-rrhh/src-rrhh.component';
import { SrcPostulanteComponent } from './src-postulante/src-postulante.component';
import { PipesModule } from '../pipes/pipes.module';
import { ConfigComponent } from './config/config.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    PagesComponent,
    UploadComponent,
    UsersComponent,
    DirsComponent,
    FilesComponent,
    SrcRrhhComponent,
    SrcPostulanteComponent,
    ConfigComponent,
    ProfilesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PagesRoutingModule,
    PipesModule,
    FontAwesomeModule
  ],
  exports: [
    PagesComponent
  ]
})
export class PagesModule { }
