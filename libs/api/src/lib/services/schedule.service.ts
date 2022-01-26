import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISchedule } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';
import { ProviderService } from './provider.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  private _schedules: BehaviorSubject<Array<ISchedule>> = new BehaviorSubject([] as Array<ISchedule>);
  public schedules$ = this._schedules.asObservable;

  public set schedules(value: Array<ISchedule>) {
    this._schedules.next(value);
  }

  public get schedules(): Array<ISchedule> {
    return this._schedules.value;
  }

  constructor(private api: ProviderService) { 
    this.load();
  }

  async load() {
    this.schedules = (await this.api.get(DB_TABLES.SCHEDULES)).data as Array<ISchedule>;
    this.api.listenTo(DB_TABLES.SCHEDULES, this._schedules);
  }

  async add(schedule: ISchedule) {
    const scheduleExists = this.schedules.some( sc => sc.schedule_name === schedule.schedule_name);

    if (!scheduleExists) {
      schedule.user_id = this.api.user.id;
      this.api.add(DB_TABLES.SCHEDULES,schedule);
    }
  }

  async update(schedule: ISchedule){
    schedule.modified_at = new Date();
    this.api.update(DB_TABLES.SCHEDULES,schedule);
  }

  async remove(id: number) {
    this.api.remove(DB_TABLES.SCHEDULES,id);
  }
}
