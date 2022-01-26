import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProviderService, IEquipment, DOTWOD_CATEGORIES, ISchedule } from '@dot-wod/api';
import { AlertController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'dot-wod-options',
  templateUrl: 'options.page.html',
  styleUrls: ['options.page.scss'],
})
export class OptionsPage implements OnInit {
  editItemFormGroup!: FormGroup;
  editItem: any;
  slidItem!: IonItemSliding;

  categories = DOTWOD_CATEGORIES;
  viewingCategory: DOTWOD_CATEGORIES = DOTWOD_CATEGORIES.SCHEDULES;
  
  constructor(private fb: FormBuilder, public provider: ProviderService, private alert: AlertController) { }

  ngOnInit(): void {
    this.editItemFormGroup = this.fb.group({
      equipment_name: ['',[Validators.required]],
      weight: ['',[Validators.min(0.5),Validators.max(100)]],
      height: ['',[Validators.min(20),Validators.max(500)]]
    })
  }

  toggleCategory(event: any){
    const selectedCategory = event?.detail?.value as DOTWOD_CATEGORIES;
    this.viewingCategory = selectedCategory;
  }

  toggleAdd(){
    this.editItem = {};
  }

  toggleEdit(item: IEquipment, equipmentSlide: IonItemSliding){
    this.slidItem = equipmentSlide;
    this.editItem = item;
    this.editItemFormGroup.patchValue(item);
  }

  applyEdit(){
    if (this.editItem){
      if (this.editItem.id && this.editItem.id > 0){
        this.provider.updateEquipment(this.editItem);
        this.slidItem.close();
      }
      else {
        this.provider.addEquipment(this.editItem);
      }
    }
    this.editItem = undefined;
  }

  cancelEdit(){
    this.editItem = undefined;
  }

  async deleteWithWarning(item: IEquipment, equipmentSlide: IonItemSliding){
    this.slidItem = equipmentSlide;
    const alert = await this.alert.create({
      header: 'Confirm delete',
      message: 'Do you wish to delete this equipment?',
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
              this.provider.removeEquipment(item.id);
              this.slidItem.close();
            }
          }
        }
      ]
    })
    await alert.present();
  }

  
}
