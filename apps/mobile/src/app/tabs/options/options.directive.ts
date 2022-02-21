import { Directive, QueryList, ViewChildren } from '@angular/core';
import { BaseServiceClass, DB_TABLES, IRow, ProviderService, toDTO } from '@dot-wod/api';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { BaseService } from 'libs/api/src/lib/services/base.service';

@Directive({
  selector: '[dotWodOptions]',
  providers: [{
    provide: BaseServiceClass, useExisting: BaseService, useValue: { dbTable: DB_TABLES }
  }]
})
export class OptionsDirective {
  @ViewChildren(IonItemSliding) slides!: QueryList<IonItemSliding>;
  editItem?: IRow;
  service: any;
  
  constructor(public svc: BaseServiceClass, public api: ProviderService, public alert: AlertController) { }

  toggleAdd(){
    this.svc.collection = [...this.svc.collection, { user_id: this.api.user.id, toDTO: toDTO }];
    this.editItem = this.svc.collection[this.svc.collection.length - 1];
  }

  toggleEdit(item: IRow) {
    this.editItem = item;
  }

  applyEdit() {
    console.log(this.editItem);
    if (this.editItem){
      if (this.editItem.id && this.editItem.id > 0){
        this.svc.update(this.editItem);
      }
      else {
        this.svc.add(this.editItem);
      }
    }
    this.editItem = undefined;
    this.slides.forEach(item => item.closeOpened());
  }

  cancelEdit() {
    if (!this.editItem?.id){
      this.svc.collection = this.svc.collection.filter( item => item.id );
    }
    this.editItem = undefined;
    this.slides.forEach(item => item.closeOpened());
  }

  toggleSubscription(item: IRow) {
    const user = item.subscriptions?.find( sub => sub === this.api.user.id);
    if (user){
      item.subscriptions = item.subscriptions?.filter( sub => sub !== this.api.user.id);
      item.isSubscribed = false;
    }
    else {
      item.subscriptions?.push(this.api.user.id);
      item.isSubscribed = true;
    }
    this.svc.update(item);
  }

  refresh() {
    this.svc.load();
  }

  async deleteWithWarning(item: IRow) {
    const alert = await this.alert.create({
      header: 'Confirm delete',
      message: `Do you wish to delete ${item.name}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: this.cancelEdit
        },
        {
          text: 'Delete',
          handler: data => {
            if (item.id !== undefined){
              this.svc.remove(item.id);
            }
          }
        }
      ]
    })
    await alert.present();
  }

  compareWith(f1: any, f2: any) {
    if (Array.isArray(f2)) {
      if (!f1) {
        return false;
      }
      return f2.find(val => val === f1);
    }
    return f1 === f2;
  };

}
