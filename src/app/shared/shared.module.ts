import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { PagesRoutingModule } from '../pages/pages-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FontAwesomeModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class SharedModule { }
