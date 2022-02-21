import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { dateDiff, DOTWOD_EXERCISEROLE, DOTWOD_HISTORY, EquipmentService, ExerciseService, FormatService, GoogleSheetApiService, groupBy, HistoryService, IAvailableEquipment, IAvailableExercise, IAvailableFormat, IAvailableSchedule, IWod, mapCommon, ProviderService, ScheduleService, TakeUntilDestroy, Wod, WodExercise, WodResult, WodService } from '@dot-wod/api';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

type WodPerDay = {
  index: number;
  duration: number;
}

type igSheetMap = {
  importId: number,
  started_at: Date,
  format: string,
  timecap: number,
  rounds: number,
  typeId: number,
  exercise: string,
  counts: string,
  equipment: string,
  equipmentQty: number,
  equipmentGauge: number,
  goal: number,
  duration: string,
  achieved: number

}

const gSheetMap = {
  importId: 'Id',
  started_at: 'Date',
  format: 'Format',
  timecap: 'TimeCap',
  rounds: 'Rounds',
  typeId: 'TypeId',
  exercise: 'Exercise',
  counts: 'Counts',
  equipment: 'Equipment',
  equipmentQty: 'Qty',
  equipmentGauge: 'Weight/Height',
  goal: 'Reps',
  duration: 'Done In',
  achieved: 'Total Reps/Sec/Met'
}

@Component({
  selector: 'dot-wod-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
})

@TakeUntilDestroy
export class HistoryPage {
  private componentDestroy!: () => Observable<unknown>;
  schedules!: Array<IAvailableSchedule>;
  formats!: Array<IAvailableFormat>;
  exercises!: Array<IAvailableExercise>;
  equipment!: Array<IAvailableEquipment>;

  importedWods!: Array<Wod>;
  week = ['S','M','T','W','T','F','S'];
  wodsPerDay: Array<WodPerDay> = [...Array(7)].map((_,i) => ({ index: i, duration: 0 }));
  weekTitle!:string;
  monthTitle!: string;
  categories = DOTWOD_HISTORY;
  viewingCategory: DOTWOD_HISTORY = DOTWOD_HISTORY.WEEK;
  documentId: string = '1fcPnPjYEL_ehGcLwWQp8RIQcUO06KYr9fTjw9pAb6Ow';
  sheetName: string = 'Wods (Apo)';

  constructor(
      public svc: WodService, 
      public googleSheets: GoogleSheetApiService, 
      public api: ProviderService,
      public scheduleSvc: ScheduleService,
      public formatSvc: FormatService, 
      public exerciseSvc: ExerciseService,
      public equipmentSvc: EquipmentService
    ) {
    const datePipe = new DatePipe('en-us');
    const today = new Date();
    const startDay = new Date();
    const endDay = new Date();
    startDay.setDate(today.getDate() - today.getDay());
    endDay.setDate(startDay.getDate() + 6);
    this.weekTitle = `${datePipe.transform(startDay,'MMM dd')} - ${datePipe.transform(endDay, 'MMM dd')}`;
    this.monthTitle = `${datePipe.transform(today, 'MMM yyyy')}`;

    this.scheduleSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((schedules) => {
      if (schedules?.length > 0){
        this.schedules = schedules as Array<IAvailableSchedule>;
      }
    });

    this.formatSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((formats) => {
      if (formats?.length > 0){
        this.formats = formats as Array<IAvailableFormat>;
      }
    });

    this.exerciseSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((exercises) => {
      if (exercises?.length > 0){
        this.exercises = exercises as Array<IAvailableExercise>;
      }
    });

    this.equipmentSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((equipment) => {
      if (equipment?.length > 0){
        this.equipment = equipment as Array<IAvailableEquipment>;
      }
    });

    this.svc._wods
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe({
      next: (wods: Array<Wod>) => {
        wods.forEach( wod => {
          const started_at:Date = new Date(wod!.results![0].started_at!.toString());
          const index = started_at?.getDay();
          const existing = this.wodsPerDay?.find( w => w.index === index);
          if (existing){
            existing.duration += wod.results![0].duration!;
          }
          else {
            this.wodsPerDay = [...(this.wodsPerDay || []),{ index: index, duration: wod.results![0].duration!}];
          }
        });
      }
    });
  }

  toggleView(event: any) {
    const selectedCategory = event?.detail?.value as DOTWOD_HISTORY;
    this.viewingCategory = selectedCategory;
  }

  import() {
    this.googleSheets.get(this.documentId,this.sheetName,gSheetMap)
    .pipe(take(1))
    .subscribe((data) => { 
      let lastImportedId = -1;
      (data as Array<igSheetMap>).forEach( item => {
        if (item.importId !== lastImportedId) {
          let wod = new Wod();
          wod.results = [new WodResult()];
          wod.importId = item.importId;
          wod.results![0].started_at = item.started_at;
          wod.name = 'Imported';
          wod.results![0].user_id = this.api.dbClient.auth.user()?.id;
          wod.schedule = this.schedules[0].program![item.typeId]?.exerciseType?.map(t=>t.type);
          wod.formatId = this.formats.find(fm => fm.name === item.format.toUpperCase())?.id! ?? -1;
          wod.timecap = item.timecap;
          wod.results![0].duration = this.getSecondsFromDuration(item.duration);
          wod.rounds = (wod.rounds ?? 0) < item.rounds ? parseInt(item.rounds.toString()) : wod.rounds;
          wod.results![0].status = 'Logged';
          this.importedWods = [...(this.importedWods ?? []),wod];
          lastImportedId = item.importId;
        }
        const lastWod = this.importedWods[this.importedWods.length -1];

        const exercise = new WodExercise();
        exercise.exerciseId = this.exercises.find(ex => ex.name === item.exercise)?.id! ?? -1;
        exercise.rounds = parseInt(item.rounds.toString());
        exercise.equipmentId = this.equipment.find(eq => eq.name === item.equipment)?.id ?? -1;
        exercise.equipmentQty = item.equipmentQty;
        exercise.achieved = item.achieved;
        exercise.goal = item.goal;
        exercise.role = this.getRoleFromCounts(item.counts);
        lastWod.results![0].exercises = [...(lastWod.results![0].exercises ?? []), exercise];
      });
      console.log(this.importedWods); 
    });
  }

  private getSecondsFromDuration(duration: string): number {
    if (duration) {
      const hms = duration.split(':');
      return parseInt(hms[0]) * 3600 + parseInt(hms[1]) * 60 + parseInt(hms[2]);
    }
    return 0;
  }

  private getRoleFromCounts(counts: string): DOTWOD_EXERCISEROLE | undefined {
    switch (counts) {
      case 'Meters':
      case 'Seconds':
      case 'Recs':
      case 'Rets':
      case 'Reps': return DOTWOD_EXERCISEROLE.COUNT
      case 'Coop': return DOTWOD_EXERCISEROLE.COOP
      case 'Buy In': return DOTWOD_EXERCISEROLE.BUYIN
      case 'Buy Out': return DOTWOD_EXERCISEROLE.BUYOUT
      case 'Interval': return DOTWOD_EXERCISEROLE.INTERVAL
      case 'Penalty': return DOTWOD_EXERCISEROLE.PENALTY
      default: return undefined;
    }
  }
}
