import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProviderService, ExerciseService, IRow, IExercise, IExerciseType, DOTWOD_EXERCISETYPES, DOTWOD_MUSCLEGROUPS, EquipmentService, IEquipment, toDTO } from '@dot-wod/api';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { OptionsDirective } from '../options.directive';

@Component({
  selector: 'dot-wod-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})
export class ExercisesComponent extends OptionsDirective implements OnInit {
  @ViewChildren(IonItemSliding) slides!: QueryList<IonItemSliding>;
  editItem: IExercise | undefined;
  exerciseTypes = Object.values(DOTWOD_EXERCISETYPES);
  muscleGroups = Object.values(DOTWOD_MUSCLEGROUPS);
  
  constructor(public svc: ExerciseService, public api: ProviderService, public alert: AlertController, public equipSvc: EquipmentService) { 
    super(svc,api,alert);
  }

  ngOnInit(): void { }

  override toggleAdd(): void {
    const newExercise = { user_id: this.api.user.id, exercise_equipment_map: [{ user_id: this.api.user.id, equipment: [] }], toDTO: toDTO };
    this.svc.collection = [...this.svc.collection, newExercise];
    this.editItem = this.svc.collection[this.svc.collection.length - 1] as IExercise;
    const self = this;
    setTimeout(() => { self.slides.last.open('start'); }, 1000);
  }

  override applyEdit(index: number) {
    if (this.editItem){
      if (this.editItem.id && this.editItem.id > 0){
        this.svc.updateMultiple([this.editItem, this.editItem.exercise_equipment_map[0]]);
      }
      else {
        const exerciseEquipment = this.editItem.exercise_equipment_map[0];
        this.svc.addMultiple([this.editItem, exerciseEquipment]);
        //console.log(this.editItem);
        //this.svc.add(this.editItem);
      }
    }
    this.editItem = undefined;
    const slide = this.slides.get(index) as IonItemSliding;
    slide.close();
  }

  setType(event: any) {
    this.editItem!.type = event.detail.value as Array<DOTWOD_EXERCISETYPES>;
  }

  setMuscleGroup(event: any) {
    this.editItem!.musclegroups = event.detail.value as Array<DOTWOD_MUSCLEGROUPS>;
  }

  setEquipment(event: any) {
    this.editItem!.exercise_equipment_map[0].equipment = event.detail.value as Array<IEquipment>;
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
