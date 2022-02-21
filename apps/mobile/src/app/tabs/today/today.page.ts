import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wod, WodResult, DOTWOD_EXERCISETYPES, IExerciseType, IAvailableSchedule, IWod, ScheduleService, FormatService, TakeUntilDestroy, IAvailableFormat, ProviderService, WodService, IWodExercise, IAvailableExercise, ExerciseService, DOTWOD_EXERCISEROLE, IAvailableEquipment, EquipmentService, IRow, DOTWOD_STATUS, compareWith } from '@dot-wod/api';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'dot-wod-today',
  templateUrl: 'today.page.html',
  styleUrls: ['today.page.scss'],
})
@TakeUntilDestroy
export class TodayPage implements OnInit, OnDestroy {
  editWod?: Wod;
  editExercise?: IWodExercise; 

  today: Date = new Date();
  todaysTypes!: Array<IExerciseType>;
  wods?: Array<Wod>;
  
  //Availables
  formats!: Array<IAvailableFormat>;
  exercises!: Array<IAvailableExercise>;
  equipment!: Array<IAvailableEquipment>;
  exerciseEquipment!: Array<IAvailableEquipment>;
  
  roles = Object.values(DOTWOD_EXERCISEROLE);
  invited!: Array<any>;

  private componentDestroy!: () => Observable<unknown>;
  public compareWith = compareWith;

  constructor(
    public api: ProviderService,
    public wodSvc: WodService,
    public alert: AlertController,
    public scheduleSvc: ScheduleService, 
    public formatSvc : FormatService,
    public exerciseSvc: ExerciseService,
    public equipSvc: EquipmentService,
    private router: Router,
    public toast: ToastController
  ) {

    this.scheduleSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe({
      next: (schedules: unknown) => {
        const schedule = (schedules as Array<IAvailableSchedule>)[0];
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
        this.formats = formats as Array<IAvailableFormat>;
      }
    });

    this.exerciseSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe({
      next: (exercises: unknown) => {
        this.exercises = exercises as Array<IAvailableExercise>;
      }
    });

    this.equipSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe({
      next: (equipment: unknown) => {
        this.equipment = equipment as Array<IAvailableEquipment>;
      }
    });
  }

  ngOnInit(): void {
    this.loadWods();
  }

  //#region Wod

  async loadWods() {
    this.wods = await this.wodSvc.getWods(true);
  }

  async applyEdit() {
    const toast = await this.toast.create({
      duration: 3000
    });

    if (!this.editWod?.id){
      if (await this.wodSvc.addWod(this.editWod!)) {
        toast.message = 'Wod was added successfully!';
      }
      else {
        toast.message = 'Error adding Wod!';
      }
    }
    else {
      if (await this.wodSvc.updateWod(this.editWod!)){
        toast.message = 'Wod was updated successfully!';
      }
      else {
        toast.message = 'Error updating Wod!';
      }
    }

    this.cancelEdit();
    toast.present();
  }

  toggleEdit(item: Wod) {
    this.editWod = item;
  }

  cancelEdit(): void {
    this.editWod = undefined;
  }

  async deleteWithWarning(item: Wod) {
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
            this.delete(item);
          }
        }
      ]
    })
    await alert.present();
  }

  async delete(item: Wod) {
    const toast = await this.toast.create({
      duration: 3000
    });

    if (await this.wodSvc.removeWod(item)) {
      toast.message = 'Wod was deleted successfully!';
    }
    else {
      toast.message = 'Error deleting Wod!';  
    }
    toast.present();
  }

  setFormat(event: any) {
    this.editWod!.formatId = event.detail.value as number;
  }

  shuffle(): void {}

  invite(): void {}

  save(): void {
    /* this.svc.update(this.historyWods); */
  }

  start(): void {
    this.router.navigateByUrl('/tabs/now');
  }

  toggleAdd(): void {
    const now = new Date();
    this.editWod = new Wod();
    this.editWod!.name = `User on ${now.toDateString()}`;
    this.editWod!.schedule = this.todaysTypes.filter(v => v.id).map(v => v.type);
    this.editWod!.results = [new WodResult()];
  }

  //#endregion

  //#region Exercises

  toggleExerciseAdd(item: IWod) {
    /* this.editItem = item;
    this.editExercise = { }; */
  }

  toggleExerciseEdit(wod: IWod, wodExercise: IWodExercise) {
    /* this.editItem = wod;
    this.editExercise = wodExercise;
    const exercise = this.historyExercises.find( ex => ex.id === this.editExercise!.exerciseId);
    this.exerciseEquipment = this.equipment!.filter( eq => exercise?.exercise_equipment_map[0].equipment?.includes(eq.id!)) ?? []; */
  }

  setExercise(event: any) {
    /* this.editExercise!.exerciseId = event.detail.value as number;
    const exercise = this.historyExercises.find( ex => ex.id === this.editExercise!.exerciseId);
    this.exerciseEquipment = this.equipment!.filter( eq => exercise?.exercise_equipment_map[0].equipment?.includes(eq.id!)) ?? []; */
  }

  setRole(event: any) {
    this.editExercise!.role = event.detail.value as DOTWOD_EXERCISEROLE;
  }

  setEquipment(event: any) {
    this.editExercise!.equipmentId = event.detail.value as number;
  }

  applyEditExercise() {
    /* if (this.editExercise){
      const exists = this.editWod!.exercises?.find( ex => ex.exerciseId === this.editExercise?.exerciseId);
      if (exists) {
        this.editWod!.exercises?.map(ex => ex.exerciseId === this.editExercise!.exerciseId ? this.editExercise! : ex);
      }
      else {
        this.editWod!.exercises = [...(this.editWod!.exercises ?? []),this.editExercise];
      }
      super.applyEdit();
    }
    this.editWod = this.editExercise = undefined; */
  }

  cancelEditExercise() {
    /* this.editItem = this.editExercise = undefined; */
  }

  //#endregion

  ngOnDestroy(): void { }

  
}


