import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dateDiff, DOTWOD_LOGBY, DOTWOD_STATUS, DOTWOD_TIMEDIRECTION, EquipmentService, ExerciseService, FormatService, HistoryService, IAvailableEquipment, IAvailableExercise, IAvailableFormat, IWod, TakeUntilDestroy, Wod, WodService } from '@dot-wod/api';
import { AlertController, ToastController } from '@ionic/angular';
import { BehaviorSubject, forkJoin, Observable, of } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
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

  formats!: Array<IAvailableFormat>;
  exercises!: Array<IAvailableExercise>;
  equipment!: Array<IAvailableEquipment>;
  wods!: Array<Wod>;
  activeWod!: Wod;

  watchStatus!: DOTWOD_STATUS;
  status = DOTWOD_STATUS;
  watchCurrent: number = 0;
  watchMax!: number;
  watchClockwise!: boolean;
  watchTimer!: WodTimer;
  watchTitle: string = 'Ready!';

  logBy = DOTWOD_LOGBY;

  showtime = false;

  private componentDestroy!: () => Observable<unknown>;

  constructor(
    public svc: WodService, 
    public formatSvc: FormatService, 
    public exerciseSvc: ExerciseService,  
    public equipmentSvc: EquipmentService,
    public alert: AlertController,
    public history: HistoryService,
    public router: Router,
    public toast: ToastController
  ) { }

  ngOnInit(): void { 
    const resources = forkJoin({ 
      formats: this.formatSvc.collection$.pipe(take(2)), 
      exercises: this.exerciseSvc.collection$.pipe(take(2)), 
      equipment: this.equipmentSvc.collection$.pipe(take(2)) 
    });
    resources.subscribe(({formats,exercises,equipment}) => {
      this.formats = formats as Array<IAvailableFormat>;
      this.exercises = exercises as Array<IAvailableExercise>;
      this.equipment = equipment as Array<IAvailableEquipment>;
      this.loadWods();
    });
  }

  async loadWods() {
    this.wods = await this.svc.getWods(true,true) as Array<Wod>;
    this.initWod();
  }

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
        this.activeWod.results![0].started_at = new Date();
      }
      this.watchStatus = DOTWOD_STATUS.RUNNING;
      this.watchTitle = this.convertSecondstoTime(this.watchCurrent);
      this.watchTimer.start();
    }
  }

  finishWod() {
    this.watchTimer.stop();
    this.activeWod.results![0].finished_at = new Date();
    this.activeWod.results![0].duration = dateDiff(this.activeWod.results![0].started_at!,this.activeWod.results![0].finished_at)/1000; 
    this.activeWod.results![0].status = DOTWOD_STATUS.FINISHED;
    this.watchStatus = this.wods.some(w => !w.results![0].finished_at) ? DOTWOD_STATUS.FINISHED : DOTWOD_STATUS.FINISHEDALL;
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
      const notLogged = this.wods.some( wod => wod.results![0].status !== DOTWOD_STATUS.LOGGED);
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
      if (wod.results![0].status !== DOTWOD_STATUS.LOGGED){
        this.logWod(wod);
      }
    })
  }

  async logWod(wod: Wod) {
    const canBeWritten = wod.results![0].exercises?.every( ex => ex.achieved !== undefined || ex.rounds !== undefined);
    if (canBeWritten) {
      const toast = await this.toast.create({
        duration: 3000
      });
      wod.results![0].exercises?.forEach( ex => {
        if (ex.achieved === undefined){
          ex.achieved = (ex.rounds! * ex.goal!) + (ex.achievedOffset ?? 0);
        }
      })
      if (wod.results![0].status === DOTWOD_STATUS.FINISHED){
        wod.results![0].status = DOTWOD_STATUS.LOGGED;
      }
      console.log(wod, ' is written in history');
      if (await this.svc.logWod(wod)){
        toast.message = 'Wod was logged successfully!';
      }
      else {
        toast.message = 'Error logging Wod!';
      }
      toast.present();
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
