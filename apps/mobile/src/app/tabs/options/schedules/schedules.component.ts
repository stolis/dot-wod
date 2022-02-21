import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { DOTWOD_EXERCISETYPES, IExerciseType, IAvailableSchedule, ProviderService, ScheduleService } from '@dot-wod/api';
import { AlertController, IonItemSliding } from '@ionic/angular';
import { OptionsDirective } from '../options.directive';

@Component({
  selector: 'dot-wod-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent extends OptionsDirective implements OnInit  {
  @ViewChildren(IonItemSliding) slides!: QueryList<IonItemSliding>;
  editItem: IAvailableSchedule | undefined;
  
  constructor(public svc: ScheduleService, public api: ProviderService, public alert: AlertController) { 
    super(svc,api,alert);
  }

  ngOnInit(): void {}

  updatePrograms() {
    if (this.editItem?.days) {
      const days = parseInt(this.editItem.days.toString());
      this.editItem.program = [...Array(days).keys()].map( x => { 
        return { 
          day: x, 
          exerciseType: [
            { 
              id: 0, 
              type: DOTWOD_EXERCISETYPES.E 
            }, 
            { 
              id: 1, 
              type: DOTWOD_EXERCISETYPES.E 
            },
            { 
              id: 2, 
              type: DOTWOD_EXERCISETYPES.E 
            }
          ]
        }
      });
    }
  }

  setExerciseType(event: any, exerciseType: IExerciseType, index: number ) {
    exerciseType.type = event.detail.value as DOTWOD_EXERCISETYPES;
  } 

  compareFn(o1: DOTWOD_EXERCISETYPES, o2: DOTWOD_EXERCISETYPES) {
    return o1 === o2;
  }
}
