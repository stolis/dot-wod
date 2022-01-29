import { Injectable } from '@angular/core';
import { BaseServiceClass, IExercise, IRow } from '../interfaces/dto';
import { ProviderService } from '.';
import { DB_TABLES } from '../types/ui';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService extends BaseService implements BaseServiceClass {

  constructor(api: ProviderService) {
    super(api);
    this.db_tables = [DB_TABLES.EXERCISES, DB_TABLES.EQUIP4EXR];
    this.load(this.api.user.id);
  }

  override async updateMultiple(items: Array<any>): Promise<void> {
    const removeProp = 'exercise_equipment_map';
    const itemsDTO = items.map( item => item.toDTO ? item.toDTO(item, [removeProp]) : item);
    super.updateMultiple(itemsDTO);
  }

  get exercises() {
    return this.collection as Array<IExercise>;
  }
}
