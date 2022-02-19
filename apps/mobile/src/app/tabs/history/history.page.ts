import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { dateDiff, DOTWOD_EXERCISEROLE, DOTWOD_HISTORY, EquipmentService, ExerciseService, FormatService, GoogleSheetApiService, HistoryService, IEquipment, IExercise, IFormat, ISchedule, IWod, ProviderService, ScheduleService, TakeUntilDestroy } from '@dot-wod/api';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

type WodPerDay = {
  index: number;
  duration: number;
}

type igSheetMap = {
  id: number,
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
  id: 'Id',
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
  schedules!: Array<ISchedule>;
  formats!: Array<IFormat>;
  exercises!: Array<IExercise>;
  equipment!: Array<IEquipment>;

  importedWods!: Array<IWod>;
  week = ['S','M','T','W','T','F','S'];
  wodsPerDay: Array<WodPerDay> = [...Array(7)].map((_,i) => ({ index: i, duration: 0 }));
  weekTitle!:string;
  monthTitle!: string;
  categories = DOTWOD_HISTORY;
  viewingCategory: DOTWOD_HISTORY = DOTWOD_HISTORY.WEEK;
  documentId: string = '1fcPnPjYEL_ehGcLwWQp8RIQcUO06KYr9fTjw9pAb6Ow';
  sheetName: string = 'Wods (Apo)';

  constructor(
      public svc: HistoryService, 
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
        this.schedules = schedules as Array<ISchedule>;
      }
    });

    this.formatSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((formats) => {
      if (formats?.length > 0){
        this.formats = formats as Array<IFormat>;
      }
    });

    this.exerciseSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((exercises) => {
      if (exercises?.length > 0){
        this.exercises = exercises as Array<IExercise>;
      }
    });

    this.equipmentSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((equipment) => {
      if (equipment?.length > 0){
        this.equipment = equipment as Array<IEquipment>;
      }
    });

    this.svc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe({
      next: (wods: Array<IWod>) => {
        wods.forEach( wod => {
          const started_at:Date = new Date(wod.started_at!.toString());
          const index = started_at?.getDay();
          const existing = this.wodsPerDay?.find( w => w.index === index);
          if (existing){
            existing.duration += wod.duration!;
          }
          else {
            this.wodsPerDay = [...(this.wodsPerDay || []),{ index: index, duration: wod.duration!}];
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
      this.importedWods = data?.map( (dt) => {
        const iDt = dt as igSheetMap;
        return {
          id: iDt.id,
          started_at: iDt.started_at,
          name: 'Imported',
          user_id: this.api.dbClient.auth.user()?.id,
          schedule: this.schedules[0].program![iDt.typeId]?.exerciseType?.map(t=>t.type), //TODO
          formatId : this.formats.find(fm => fm.name === iDt.format)?.id! ?? -1,
          timecap: iDt.timecap,
          exercises: [
            { 
              exerciseId: this.exercises.find(ex => ex.name === iDt.exercise)?.id! ?? -1,
              rounds: parseInt(iDt.rounds.toString()),
              equipmentId: this.equipment.find(eq => eq.name === iDt.equipment)?.id ?? -1,
              equipmentQty: iDt.equipmentQty,
              achieved: iDt.achieved,
              goal: iDt.goal,
              role: this.getRoleFromCounts(iDt.counts) //TODO iDt.counts
            }
          ],
          duration: this.getSecondsFromDuration(iDt.duration),
          rounds: parseInt(iDt.rounds.toString()), 
          inserted_at: iDt.started_at,
          isSubscribed: true,
          is_deleted: false,
          modified_at: new Date,
          status: 'Logged'
        } as IWod;
      })
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
