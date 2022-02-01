import { Injectable } from '@angular/core';
import { ProviderService } from '@dot-wod/api';
import { BehaviorSubject } from 'rxjs';
import { toDTO } from '../functions/helpers';
import { IExercise, IRow } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public db_tables!: Array<DB_TABLES>;
  public _collection: BehaviorSubject<Array<IRow>> = new BehaviorSubject([] as Array<IRow>);
  public collection$ = this._collection.asObservable;

  public set collection(value: Array<IRow>) {
    this._collection.next(value);
  }

  public get collection(): Array<IRow> {
    return this._collection.value;
  }

  constructor(public api: ProviderService) { }

  async load(userId?: string) {
    if (this.db_tables.length === 1){
      this.collection = (await this.api.get(this.db_tables[0],userId)).data as Array<IRow>;
    }
    else {
      this.collection = (await this.api.getJoined(this.db_tables,userId)).data as Array<IRow>;
      (this.collection as Array<IExercise>)?.forEach( sc => {
        sc.exercise_equipment_map = sc.exercise_equipment_map && sc.exercise_equipment_map[0] ? sc.exercise_equipment_map : [{ exerciseId: sc.id, user_id: userId }];  
      });
    }
    (this.collection as Array<IExercise>)?.forEach( sc => {
      sc.subscriptions = sc.subscriptions ?? [];
      sc.isSubscribed = sc.subscriptions?.includes(this.api.user.id);
      sc.toDTO = toDTO;
    });
  }

  async addMultiple(items: Array<IRow>) {
    this.db_tables.forEach( (db_table, index) => {
      this.add(items[index],db_table);
    });
  }

  async updateMultiple(items: Array<any>) {
    this.db_tables.forEach( (db_table, index) => {
      this.update(items[index],db_table);
    });
  }

  async removeMultiple(ids: Array<number>) {
    this.db_tables.forEach( (db_table, index) => {
      this.remove(ids[index],db_table);
    });
  }

  async add(item: IRow, table?: DB_TABLES) {
    table = table ?? this.db_tables[0];
    const itemExists = this.collection.some( sc => sc.name === item.name && sc.id !== item.id);

    if (!itemExists) {
      item.user_id = this.api.user.id;
      const itemDTO = item.toDTO ? item.toDTO(item,['isSubscribed']) : item;
      const added = (await this.api.add(table,itemDTO)).data;
      if (added && added?.length > 0 && added[0].id) {
        item.id = added[0].id;
      }
      else {
        console.error('Item was not added!', added);
      }
    }
  }

  async update(item: any, table?: DB_TABLES){
      table = table ?? this.db_tables[0];
      
      if (Object(item).hasOwnProperty('modified_at')){
        item.modified_at = new Date();
      }

      const itemDTO = item.toDTO ? item.toDTO(item,['isSubscribed']) : item;
      const updated = (await this.api.update(table,itemDTO)).data;

      if (!(updated && updated?.length > 0 && updated[0].id)) {
        console.error('Item was not updated!', updated);
      }
  }

  async remove(id: number, table?: DB_TABLES) {
    table = table ?? this.db_tables[0];
    const deleted = (await this.api.remove(table,id)).data;
    if (deleted && deleted?.length > 0 && deleted[0].id) {
      this.collection = this.collection.filter( eq => eq.id !== deleted[0].id);
    }
    else {
      console.error('Item was not deleted!', deleted);
    }
  }

}
