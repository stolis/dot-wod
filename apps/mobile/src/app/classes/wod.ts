import { Observable, Subject, Subscription, timer } from 'rxjs';
import {
  ExerciseAttributeEnum,
  FormatEnum,
  FormatFlowEnum,
  GaugeEnum,
  ModalityEnum,
} from '../enums/enums';

export const Schedule = [
  'M',
  'G,W',
  'M,G,W',
  'M,G',
  'W',
  'G',
  'W,M',
  'G,W,M',
  'G,W',
  'M',
  'W',
  'M,G',
  'W,M,G',
  'W,M',
  'G',
];

export class WodDay {
  id: number | undefined;
  date: Date | undefined;
  schedule: string | undefined;
}

export class Wod {
  id: number | undefined;
  format: FormatEnum | undefined;
  timecap: number | undefined;
  rounds: number | undefined;
  flow: FormatFlowEnum | undefined;
  exercises: Array<Exercise> | undefined;
}

export class Exercise {
  id: number | undefined;
  name: string | undefined;
  gauge: number | undefined;
  gaugeType: GaugeEnum | undefined;
  attribute: ExerciseAttributeEnum | undefined;
  modality: ModalityEnum | undefined;
}

export class WodTimer {
  private timeElapsed = 0;
  private timer?: Observable<any>;
  private subscription!: Subscription;
  private readonly step!: number;
  update = new Subject<number>();

  constructor(step: number = 1000) {
    this.timeElapsed = 0;
    this.step = step;
  }

  start() {
    this.timer = timer(this.step,this.step);
    this.subscription = this.timer.subscribe(()=>{
      this.timeElapsed = this.timeElapsed + this.step;
      this.update.next(this.timeElapsed);
    });
  }

  pause() {
    if (this.timer) {
      this.subscription.unsubscribe();
      this.timer = undefined;
    }
    else {
      this.start();
    }
  }

  stop() {
    if (this.timer) {
      this.subscription.unsubscribe();
      this.timer = undefined;
      this.timeElapsed = 0;
    }
  }
}


