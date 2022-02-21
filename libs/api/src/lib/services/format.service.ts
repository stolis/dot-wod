import { Injectable } from '@angular/core';
import { ProviderService } from '.';
import { BaseServiceClass, IAvailableFormat } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class FormatService extends BaseService implements BaseServiceClass {

  constructor(api: ProviderService) { 
    super(api);
    this.db_tables = [DB_TABLES.FORMATS];
    this.load();
  }

  get formats() {
    return this.collection as Array<IAvailableFormat>;
  }
}
