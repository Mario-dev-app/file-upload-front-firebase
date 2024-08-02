import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UploadComponent } from './upload/upload.component';
import { UsersComponent } from './users/users.component';
import { IsAdminRoleGuard } from '../services/guards/is-admin-role.guard';
import { DirsComponent } from './dirs/dirs.component';
import { FilesComponent } from './files/files.component';
import { SrcPostulanteComponent } from './src-postulante/src-postulante.component';
import { ConfigComponent } from './config/config.component';
import { SrcRrhhComponent } from './src-rrhh/src-rrhh.component';
import { TokenValidGuard } from '../services/guards/token-valid.guard';
import { ProfilesComponent } from './profiles/profiles.component';

const routes: Routes = [
  {path: 'users', component: UsersComponent, canActivate: [IsAdminRoleGuard, TokenValidGuard]},
  {path: 'dirs', component: DirsComponent, canActivate: [IsAdminRoleGuard, TokenValidGuard]},
  {path: 'profiles', component: ProfilesComponent, canActivate: [IsAdminRoleGuard, TokenValidGuard]},
  {path: 'files/:dirname', component: FilesComponent, canActivate: [IsAdminRoleGuard, TokenValidGuard]},
  {path: 'upload', component: UploadComponent, canActivate: [TokenValidGuard]},
  {path: 'config', component: ConfigComponent, canActivate: [IsAdminRoleGuard, TokenValidGuard]},
  {path: 'src-postulante', component: SrcPostulanteComponent, canActivate: [TokenValidGuard]},
  /* {path: 'src-rrhh', component: SrcRrhhComponent}, */
  { path: '', pathMatch: 'full', redirectTo: 'files'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
