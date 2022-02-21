import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IAvailableEquipment } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';
import { BaseService } from './base.service';
import { ProviderService } from './provider.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends BaseService {

  constructor(api: ProviderService) {
    super(api);
    this.db_tables = [DB_TABLES.EQUIPMENT]; 
    this.load();
  }

  get equipment() {
    return this.collection as Array<IAvailableEquipment>;
  }
  
}
