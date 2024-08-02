import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapitalizeMayusPipe } from './capitalize-mayus.pipe';


@NgModule({
  declarations: [CapitalizeMayusPipe],
  imports: [
    CommonModule
  ],
  exports: [CapitalizeMayusPipe]
})
export class PipesModule { }
