import { Injectable } from '@angular/core';
import { BaseServiceClass, ISchedule } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';
import { BaseService } from './base.service';
import { ProviderService } from './provider.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService extends BaseService implements BaseServiceClass {

  constructor(api: ProviderService) {
    super(api);
    this.db_tables = [DB_TABLES.SCHEDULES];
    this.load();
  }

  get schedules() {
    return this.collection as Array<ISchedule>;
  }
}
