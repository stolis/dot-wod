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

  /* async testLoad(){
    this.collection = (await this.api.dbClient.from('exercise')
    //.select('*,exercise_equipment_map(*)')).data as Array<IRow>;
    .select('*, exercise_equipment_map!inner(*)')
    .eq('exercise_equipment_map.user_id',this.api.user.id)).data as Array<IRow>;
    console.log(this.collection);
  } */

  get exercises() {
    return this.collection as Array<IExercise>;
  }
}
