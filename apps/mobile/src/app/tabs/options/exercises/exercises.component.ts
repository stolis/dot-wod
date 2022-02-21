import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ProviderService, ExerciseService, IAvailableExercise, DOTWOD_EXERCISETYPES, DOTWOD_MUSCLEGROUPS, EquipmentService, IAvailableEquipment, toDTO, DOTWOD_EXERCISEGAUGE, TakeUntilDestroy } from '@dot-wod/api';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OptionsDirective } from '../options.directive';

@Component({
  selector: 'dot-wod-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss']
})

@TakeUntilDestroy
export class ExercisesComponent extends OptionsDirective implements OnInit {
  private componentDestroy!: () => Observable<unknown>;
  @ViewChildren(IonItemSliding) slides!: QueryList<IonItemSliding>;
  uiExercises!: Array<IAvailableExercise>;
  orderIsAscending: boolean = false;
  editItem: IAvailableExercise | undefined;
  equipment!: Array<IAvailableEquipment>;
  exerciseTypes = Object.values(DOTWOD_EXERCISETYPES);
  muscleGroups = Object.values(DOTWOD_MUSCLEGROUPS);
  gauges = Object.values(DOTWOD_EXERCISEGAUGE);
  
  constructor(public svc: ExerciseService, public api: ProviderService, public alert: AlertController, public equipSvc: EquipmentService) { 
    super(svc,api,alert);
    this.svc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((exercises) => {
      if (exercises?.length > 0){
        this.uiExercises = (exercises as Array<IAvailableExercise>).sort((a,b) => a.name! < b.name! ? this.orderIsAscending ? -1 : 1 : this.orderIsAscending ? 1 : -1);
      }
    });
  }

  ngOnInit(): void {}

  override toggleAdd(): void {
    const newExercise = { user_id: this.api.user.id, exercise_equipment_map: [{ user_id: this.api.user.id, equipment: [] }], toDTO: toDTO };
    if (this.orderIsAscending) {
      this.uiExercises = [...this.uiExercises, newExercise] as Array<IAvailableExercise>;
      this.editItem = this.uiExercises[this.svc.collection.length - 1] as IAvailableExercise;
    }
    else {
      this.uiExercises = [newExercise, ...this.svc.collection] as Array<IAvailableExercise>;
      this.editItem = this.uiExercises[0] as IAvailableExercise;
    }
    
  }

  toggleOrder() {
    this.orderIsAscending = !this.orderIsAscending;
    this.uiExercises = this.uiExercises.sort((a,b) => a.name! < b.name! ? this.orderIsAscending ? -1 : 1 : this.orderIsAscending ? 1 : -1);
  }

  override applyEdit() {
    if (this.editItem){
      if (this.editItem.id && this.editItem.id > 0){
        this.svc.updateMultiple([this.editItem, this.editItem.available_exercise_equipment_map[0]]);
      }
      else {
        const exerciseEquipment = this.editItem.available_exercise_equipment_map[0];
        this.svc.addMultiple([this.editItem, exerciseEquipment]);
      }
    }
    this.editItem = undefined;
  }

  override refresh() {
    this.svc.load(this.api.user.id);
  }

  async deleteWithWarning(item: IAvailableExercise) {
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
              if (item.available_exercise_equipment_map[0].id){
                this.svc.removeMultiple([item.id, item.available_exercise_equipment_map[0].id]);
              }
              else {
                this.svc.remove(item.id);
              }
            }
          }
        }
      ]
    })
    await alert.present();
  }

  setType(event: any) {
    this.editItem!.type = event.detail.value as Array<DOTWOD_EXERCISETYPES>;
  }

  setMuscleGroup(event: any) {
    this.editItem!.musclegroups = event.detail.value as Array<DOTWOD_MUSCLEGROUPS>;
  }

  setGauge(event: any) {
    this.editItem!.gauge = event.detail.value as DOTWOD_EXERCISEGAUGE;
  }

  setEquipment(event: any) {
    this.editItem!.available_exercise_equipment_map[0].equipment = event.detail.value as Array<number>;
  }

  

}
