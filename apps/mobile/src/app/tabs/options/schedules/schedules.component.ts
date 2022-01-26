import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DOTWOD_EXERCISETYPES, IProgram, ISchedule, ScheduleService } from '@dot-wod/api';
import { AlertController, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'dot-wod-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit {
  editItemFormGroup!: FormGroup;
  editItem: ISchedule | undefined;
  slidItem!: IonItemSliding;

  constructor(private fb: FormBuilder, public svc: ScheduleService, private alert: AlertController) { }

  ngOnInit(): void {
    this.editItemFormGroup = this.fb.group({
      schedule_name: ['',[Validators.required]],
      day: ['',[Validators.min(1),Validators.max(365)]],
      days: ['',[Validators.min(2),Validators.max(365)]]
    });
  }

  toggleAdd(){
    this.editItem = {};
  }

  toggleEdit(item: ISchedule, schedulesSlide: IonItemSliding){
    this.slidItem = schedulesSlide;
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

  async deleteWithWarning(item: ISchedule, schedulesSlide: IonItemSliding){
    this.slidItem = schedulesSlide;
    const alert = await this.alert.create({
      header: 'Confirm delete',
      message: 'Do you wish to delete this schedule?',
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

  updatePrograms() {
    if (this.editItem?.days) {
      const days = parseInt(this.editItem.days.toString());
      this.editItem.program = [...Array(days).keys()].map( x => { return { day: x, exerciseType: [DOTWOD_EXERCISETYPES.M] } });
    }
  }

  addExerciseType(program: IProgram) {
    program.exerciseType?.push(DOTWOD_EXERCISETYPES.M);
  }

}
