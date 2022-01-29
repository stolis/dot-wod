import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProviderService, ExerciseService, IRow, IExercise, IExerciseType, DOTWOD_EXERCISETYPES, DOTWOD_MUSCLEGROUPS, EquipmentService, IEquipment } from '@dot-wod/api';
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

  ngOnInit(): void {
    
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
