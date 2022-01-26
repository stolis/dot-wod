import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IEquipment, EquipmentService } from '@dot-wod/api';
import { IonItemSliding, AlertController } from '@ionic/angular';

@Component({
  selector: 'dot-wod-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit {
  editItemFormGroup!: FormGroup;
  editItem: IEquipment | undefined;
  slidItem!: IonItemSliding;

  constructor(private fb: FormBuilder, public svc: EquipmentService, private alert: AlertController) { }

  ngOnInit(): void {
    this.editItemFormGroup = this.fb.group({
      equipment_name: ['',[Validators.required]],
      weight: ['',[Validators.min(0.5),Validators.max(100)]],
      height: ['',[Validators.min(20),Validators.max(500)]]
    });
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
        this.svc.update(this.editItem);
        this.slidItem.close();
      }
      else {
        this.svc.add(this.editItem);
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
              this.svc.remove(item.id);
              this.slidItem.close();
            }
          }
        }
      ]
    })
    await alert.present();
  }

}
