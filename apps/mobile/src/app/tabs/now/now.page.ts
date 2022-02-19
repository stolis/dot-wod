import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dateDiff, DOTWOD_LOGBY, DOTWOD_STATUS, DOTWOD_TIMEDIRECTION, EquipmentService, ExerciseService, FormatService, HistoryService, IEquipment, IExercise, IFormat, IWod, TakeUntilDestroy, WodService } from '@dot-wod/api';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WodTimer } from '../../classes/wod';

@Component({
  selector: 'dot-wod-now',
  templateUrl: './now.page.html',
  styleUrls: ['./now.page.scss']
})
@TakeUntilDestroy
export class NowPage implements OnInit {
  private requirements: number = 4;
  private currentLoad: BehaviorSubject<number> = new BehaviorSubject(0);

  formats!: Array<IFormat>;
  exercises!: Array<IExercise>;
  equipment!: Array<IEquipment>;
  wods!: Array<IWod>;
  activeWod!: IWod;

  watchStatus!: DOTWOD_STATUS;
  status = DOTWOD_STATUS;
  watchCurrent: number = 0;
  watchMax!: number;
  watchClockwise!: boolean;
  watchTimer!: WodTimer;
  watchTitle: string = 'Ready!';

  logBy = DOTWOD_LOGBY;

  private componentDestroy!: () => Observable<unknown>;

  constructor(
    public svc: WodService, 
    public formatSvc: FormatService, 
    public exerciseSvc: ExerciseService,  
    public equipmentSvc: EquipmentService,
    public alert: AlertController,
    public history: HistoryService,
    public router: Router
  ) {

    //#region load all required rows

    this.currentLoad
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe( current => {
      if (current === this.requirements){
        this.initWod();
      }
    });

    this.svc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((wods) => {
        if (wods?.length > 0){
          this.wods = wods as Array<IWod>;
          this.currentLoad.next(this.currentLoad.value + 1);
        }
      });

    this.formatSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((formats) => {
      if (formats?.length > 0){
        this.formats = formats as Array<IFormat>;
        this.currentLoad.next(this.currentLoad.value + 1);
      }
    });

    this.exerciseSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((exercises) => {
      if (exercises?.length > 0){
        this.exercises = exercises as Array<IExercise>;
        this.currentLoad.next(this.currentLoad.value + 1);
      }
    });

    this.equipmentSvc._collection
    .pipe(takeUntil(this.componentDestroy()))
    .subscribe((equipment) => {
      if (equipment?.length > 0){
        this.equipment = equipment as Array<IEquipment>;
        this.currentLoad.next(this.currentLoad.value + 1);
      }
    });

    //#endregion
    
  }

  ngOnInit(): void { }

  initWod(index: number = 0): void {
    this.watchStatus = DOTWOD_STATUS.READY;
    this.activeWod = this.wods[index];
    const format = this.formats.find( f => f.id === this.activeWod.formatId);
    if (format){
      if (format.time_direction === DOTWOD_TIMEDIRECTION.TIMER || (this.activeWod.timecap && this.activeWod.timecap > 0)){
        this.watchClockwise = false;
        this.watchMax = this.activeWod.timecap! * 60;
      }
      else {
        this.watchClockwise = true;
        this.watchMax = 3600;
      }
      this.watchTimer = new WodTimer();
      this.watchTimer.update
      .pipe(takeUntil(this.componentDestroy()))
      .subscribe( timeEllapsed => {
        this.watchCurrent = this.watchClockwise ? timeEllapsed / 1000 : this.watchMax - timeEllapsed / 1000;
        if (this.watchCurrent <= 0){
          this.finishWod();
        }
        this.watchTitle = this.convertSecondstoTime(this.watchCurrent);
      });
    }
  }

  toggleTimer() {
    if (this.watchStatus === DOTWOD_STATUS.RUNNING) {
      this.watchStatus = DOTWOD_STATUS.PAUSED;
      this.watchTitle = this.watchStatus; 
      this.watchTimer.pause();
    }
    else {
      if (this.watchStatus === DOTWOD_STATUS.READY) {
        this.activeWod.started_at = new Date();
      }
      this.watchStatus = DOTWOD_STATUS.RUNNING;
      this.watchTitle = this.convertSecondstoTime(this.watchCurrent);
      this.watchTimer.start();
    }
  }

  finishWod() {
    this.watchTimer.stop();
    this.activeWod.finished_at = new Date();
    this.activeWod.duration = dateDiff(this.activeWod.started_at!,this.activeWod.finished_at)/1000; 
    this.activeWod.status = DOTWOD_STATUS.FINISHED;
    this.watchStatus = this.wods.some(w => !w.finished_at) ? DOTWOD_STATUS.FINISHED : DOTWOD_STATUS.FINISHEDALL;
    this.watchTitle = this.watchStatus;
  }

  registerWod() {
    this.watchStatus = DOTWOD_STATUS.LOGGING;
  }

  async startNext() {
    const activeIndex = this.wods.findIndex( wod => wod.id === this.activeWod.id);
    if (activeIndex !== this.wods.length - 1){
      this.initWod(activeIndex + 1);
    }
    else {
      const notLogged = this.wods.some( wod => wod.status !== DOTWOD_STATUS.LOGGED);
      if (notLogged){
        const alert = await this.alert.create({
          header: 'Not all Wods are logged!',
          message: `Do you wish to continue without logging?`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Continue',
              handler: data => {
                this.wods.forEach( wod => this.history.add(wod));
              }
            }
          ]
        })
        await alert.present();
      }
      else {
        this.wods.forEach( wod => this.history.add(wod));
        this.router.navigateByUrl('/tabs/history');
      }
    }
  }

  public logWods(): void {
    this.wods!.forEach( wod => {
      if (wod.status !== DOTWOD_STATUS.LOGGED){
        this.logWod(wod);
      }
    })
  }

  public logWod(wod: IWod): void {
    const canBeWritten = wod.exercises?.every( ex => ex.achieved !== undefined || ex.rounds !== undefined);
    if (canBeWritten) {
      wod.exercises?.forEach( ex => {
        if (ex.achieved === undefined){
          ex.achieved = (ex.rounds! * ex.goal!) + (ex.achievedOffset ?? 0);
        }
      })
      if (wod.status === DOTWOD_STATUS.FINISHED){
        wod.status = DOTWOD_STATUS.LOGGED;
      }
      console.log(wod.id, ' is written in history');
    }
  }

  private convertSecondstoTime(sec: number) {
    const dateObj = new Date(sec * 1000);
    const hours = dateObj.getUTCHours();
    const minutes = dateObj.getUTCMinutes();
    const seconds = dateObj.getSeconds();

    const timeString = hours.toString().padStart(2, '0')
        + ':' + minutes.toString().padStart(2, '0')
        + ':' + seconds.toString().padStart(2, '0');
    return timeString;
  }
}
