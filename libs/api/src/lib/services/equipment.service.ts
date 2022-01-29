import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IEquipment } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';
import { BaseService } from './base.service';
import { ProviderService } from './provider.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends BaseService {

  /* private _equipment: BehaviorSubject<Array<IEquipment>> = new BehaviorSubject([] as Array<IEquipment>);
  public equipment$ = this._equipment.asObservable;

  public set equipment(value: Array<IEquipment>) {
    this._equipment.next(value);
  }

  public get equipment(): Array<IEquipment> {
    return this._equipment.value;
  } */

  constructor(api: ProviderService) {
    super(api);
    this.db_tables = [DB_TABLES.EQUIPMENT]; 
    this.load();
  }

  get equipment() {
    return this.collection as Array<IEquipment>;
  }

  /* async load() {
    this.equipment = (await this.api.get(DB_TABLES.EQUIPMENT)).data as Array<IEquipment>;
  }

  async add(equipment: IEquipment) {
    const equipmentExists = this.equipment.some( sc => sc.equipment_name === equipment.equipment_name && sc.weight === equipment.weight && sc.height === equipment.height && sc.id !== equipment.id);

    if (!equipmentExists) {
      equipment.user_id = this.api.user.id;
      const added = (await this.api.add(DB_TABLES.EQUIPMENT,equipment)).data;
      if (added && added?.length > 0 && added[0].id) {
        equipment.id = added[0].id;
      }
      else {
        console.error('Equipment was not added!');
      }
    }
  }

  async update(equipment: IEquipment) {
    equipment.modified_at = new Date();
    const updated = (await this.api.update(DB_TABLES.EQUIPMENT,equipment)).data;
    if (!(updated && updated?.length > 0 && updated[0].id)) {
      console.error('Equipment was not updated!');
    }
  }

  async remove(id: number) {
    const deleted = (await this.api.remove(DB_TABLES.EQUIPMENT,id)).data;
    if (deleted && deleted?.length > 0 && deleted[0].id) {
      this.equipment = this.equipment.filter( eq => eq.id !== deleted[0].id);
    }
    else {
      console.error('Equipment was not deleted!');
    }
  } */
}
