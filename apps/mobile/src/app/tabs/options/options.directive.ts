import { Directive } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';

@Directive({
  selector: '[dotWodOptions]',
  host: {
    '(toggleAdd)': 'toggleAdd()',
    '(toggleEdit)': 'toggleEdit()'
  }
})
export class OptionsDirective {

  slidItem!: IonItemSliding;

  constructor() { }

  toggleAdd(){
    console.log('toggleAdd');
  }

  toggleEdit(a: any){
    console.log('toggleEdit: ', a);
  }

}
