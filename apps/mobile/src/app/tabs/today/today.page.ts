import { Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DOTWOD_EXERCISETYPES, IExerciseType, ISchedule, IWod, ScheduleService, FormatService, TakeUntilDestroy, IFormat, BaseServiceClass, ProviderService, WodService, IWodExercise } from '@dot-wod/api';
import { AlertController, IonItemSliding } from '@ionic/angular';
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
  @ViewChildren(IonItemSliding) slides!: QueryList<IonItemSliding>;
  editItem: IWod | undefined;
  editExercise?: IWodExercise; 
  today: Date = new Date();
  todaysTypes!: Array<IExerciseType>;
  wods!: Array<IWod>;
  formats!: Array<IFormat>;

  private componentDestroy!: () => Observable<unknown>;
  
  constructor(
    public svc: WodService,
    public api: ProviderService,
    public alert: AlertController,
    public scheduleSvc: ScheduleService, 
    public formatSvc : FormatService
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
          this.formats = formats as  Array<IFormat>;
        }
      })
  }

  ngOnInit(): void { }

  setFormat(event: any) {
    this.editItem!.formatId = event.detail.value as number;
  }

  shuffle(): void {}

  toggleExerciseAdd(item: IWod) {
    this.editItem = item;
    this.editExercise = { };
  }

  applyEditExercise() {
    console.log('apply ex');
  }

  cancelEditExercise() {
    this.editItem = this.editExercise = undefined;
    console.log('cancel ex');
  }

  ngOnDestroy(): void { }
}


