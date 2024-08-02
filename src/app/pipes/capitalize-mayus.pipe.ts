import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeMayus'
})
export class CapitalizeMayusPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    let tempArr = value.split(/(?=[A-Z])/);
    let newValue = '';
    tempArr.forEach(val => {
      newValue = `${newValue} ${val[0].toUpperCase()}${val.slice(1)}`;
    });
    return newValue.trim();
  }

}
