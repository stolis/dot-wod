import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IEquipment } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';
import { ProviderService } from './provider.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private _equipment: BehaviorSubject<Array<IEquipment>> = new BehaviorSubject([] as Array<IEquipment>);
  public equipment$ = this._equipment.asObservable;

  public set equipment(value: Array<IEquipment>) {
    this._equipment.next(value);
  }

  public get equipment(): Array<IEquipment> {
    return this._equipment.value;
  }

  constructor(private api: ProviderService) { 
    this.load();
  }

  async load() {
    this.equipment = (await this.api.get(DB_TABLES.EQUIPMENT)).data as Array<IEquipment>;
    this.api.listenTo(DB_TABLES.EQUIPMENT, this._equipment);
  }

  async add(equipment: IEquipment) {
    const equipmentExists = this.equipment.some( sc => sc.equipment_name === equipment.equipment_name);

    if (!equipmentExists) {
      equipment.user_id = this.api.user.id;
      this.api.add(DB_TABLES.EQUIPMENT,equipment);
    }
  }

  async update(schedule: IEquipment){
    schedule.modified_at = new Date();
    this.api.update(DB_TABLES.EQUIPMENT,schedule);
  }

  async remove(id: number) {
    this.api.remove(DB_TABLES.EQUIPMENT,id);
  }
}
