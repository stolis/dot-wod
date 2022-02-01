import { Component, OnDestroy, OnInit } from '@angular/core';
import { DOTWOD_EXERCISETYPES, IExerciseType, ISchedule, IWod, ScheduleService, FormatService, TakeUntilDestroy, IFormat, ProviderService, WodService, IWodExercise, IExercise, ExerciseService, DOTWOD_EXERCISEROLE, IEquipment, EquipmentService } from '@dot-wod/api';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OptionsDirective } from '../options/options.directive';

@Component({
  selector: 'dot-wod-today',
  templateUrl: 'today.page.html',
  styleUrls: ['today.page.scss'],
})
@TakeUntilDestroy
export class TodayPage extends OptionsDirective implements OnInit, OnDestroy {
  editItem: IWod | undefined;
  editExercise?: IWodExercise; 
  today: Date = new Date();
  todaysTypes!: Array<IExerciseType>;
  wods!: Array<IWod>;
  formats!: Array<IFormat>;
  exercises!: Array<IExercise>;
  roles = Object.values(DOTWOD_EXERCISEROLE);
  equipment!: Array<IEquipment>;
  exerciseEquipment!: Array<IEquipment>;
  invited!: Array<any>;

  private componentDestroy!: () => Observable<unknown>;
  
  constructor(
    public svc: WodService,
    public api: ProviderService,
    public alert: AlertController,
    public scheduleSvc: ScheduleService, 
    public formatSvc : FormatService,
    public exerciseSvc: ExerciseService,
    public equipSvc: EquipmentService
  ) {
    super(svc,api,alert);
     this.scheduleSvc._collection
     .pipe(takeUntil(this.componentDestroy()))
     .subscribe({
        next: (schedules: unknown) => {
          const schedule = (schedules as Array<ISchedule>)[0];
          if (schedule){
            const program = schedule.program?.filter( pr => pr.day === schedule.day)[0];
            this.todaysTypes = program?.exerciseType!.filter( type => type.type !== DOTWOD_EXERCISETYPES.E)!;
          }
        }
      });

      this.formatSvc._collection
      .pipe(takeUntil(this.componentDestroy()))
      .subscribe({
        next: (formats: unknown) => {
          this.formats = formats as Array<IFormat>;
        }
      });

      this.exerciseSvc._collection
      .pipe(takeUntil(this.componentDestroy()))
      .subscribe({
        next: (exercises: unknown) => {
          this.exercises = exercises as Array<IExercise>;
        }
      });

      this.equipSvc._collection
      .pipe(takeUntil(this.componentDestroy()))
      .subscribe({
        next: (equipment: unknown) => {
          this.equipment = equipment as Array<IEquipment>;
        }
      });
  }

  ngOnInit(): void {}

  //#region Wod

  setFormat(event: any) {
    this.editItem!.formatId = event.detail.value as number;
  }

  shuffle(): void {}

  invite(): void {}

  start(): void {}

  //#endregion

  //#region Exercises

  toggleExerciseAdd(item: IWod) {
    this.editItem = item;
    this.editExercise = { };
  }

  toggleExerciseEdit(wod: IWod, wodExercise: IWodExercise) {
    this.editItem = wod;
    this.editExercise = wodExercise;
    const exercise = this.exercises.find( ex => ex.id === this.editExercise!.exerciseId);
    this.exerciseEquipment = this.equipment!.filter( eq => exercise?.exercise_equipment_map[0].equipment?.includes(eq.id!)) ?? [];
  }

  setExercise(event: any) {
    this.editExercise!.exerciseId = event.detail.value as number;
    const exercise = this.exercises.find( ex => ex.id === this.editExercise!.exerciseId);
    this.exerciseEquipment = this.equipment!.filter( eq => exercise?.exercise_equipment_map[0].equipment?.includes(eq.id!)) ?? [];
  }

  setRole(event: any) {
    this.editExercise!.role = event.detail.value as DOTWOD_EXERCISEROLE;
  }

  setEquipment(event: any) {
    this.editExercise!.equipmentId = event.detail.value as number;
  }

  applyEditExercise() {
    if (this.editExercise){
      const exists = this.editItem!.exercises?.find( ex => ex.exerciseId === this.editExercise?.exerciseId);
      if (exists) {
        this.editItem!.exercises?.map(ex => ex.exerciseId === this.editExercise!.exerciseId ? this.editExercise! : ex);
      }
      else {
        this.editItem!.exercises = [...(this.editItem!.exercises ?? []),this.editExercise];
      }
      super.applyEdit();
    }
    this.editItem = this.editExercise = undefined;
  }

  cancelEditExercise() {
    this.editItem = this.editExercise = undefined;
  }

  //#endregion

  ngOnDestroy(): void { }
}


