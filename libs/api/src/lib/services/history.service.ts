import { Injectable } from '@angular/core';
import { ProviderService } from '.';
import { BaseServiceClass, IWod } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends BaseService implements BaseServiceClass {

  constructor(api: ProviderService) { 
    super(api);
    this.db_tables = [DB_TABLES.HISTORY];
    this.load();
  }

  get wods() {
    return this.collection as Array<IWod>;
  }
}
