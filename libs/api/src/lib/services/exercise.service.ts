import { Injectable } from '@angular/core';
import { BaseServiceClass, IExercise } from '../interfaces/dto';
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

  override async addMultiple(items: Array<any>): Promise<void> {
    const removeProp = 'exercise_equipment_map';
    const exerciseDTO = items[0].toDTO(items[0], [removeProp]);
    const result = await this.api.add(DB_TABLES.EXERCISES,exerciseDTO);
    const updatedExercise = result?.data ? result?.data[0] : undefined;
    if (updatedExercise){
      const exerciseEquipmentDTO = items[1];
      exerciseEquipmentDTO.exerciseId = updatedExercise.id;
      const result = await this.api.add(DB_TABLES.EQUIP4EXR,exerciseEquipmentDTO);
    }
  }

  override async updateMultiple(items: Array<any>): Promise<void> {
    const removeProps = ['exercise_equipment_map', 'isSubscribed'];
    const exerciseDTO = items[0].toDTO(items[0], removeProps);
    const result = await this.api.update(DB_TABLES.EXERCISES,exerciseDTO);
    const updatedExercise = result?.data ? result?.data[0] : undefined;
    if (updatedExercise){
      const exerciseEquipmentDTO = items[1];
      if (exerciseEquipmentDTO.id) {
        super.update(exerciseEquipmentDTO, DB_TABLES.EQUIP4EXR);
      }
      else {
        super.add(exerciseEquipmentDTO, DB_TABLES.EQUIP4EXR);
      }
    }
  }

  override async update(item: any) {
    const removeProps = ['exercise_equipment_map', 'isSubscribed'];
    const exerciseDTO = item.toDTO(item, removeProps);
    const result = await this.api.update(DB_TABLES.EXERCISES,exerciseDTO);
  }

  override async remove(id: number): Promise<void> {
    const result = await this.api.remove(DB_TABLES.EQUIP4EXR,id,'exerciseId');
    if (result.data && result.data?.length > 0){
      await this.api.remove(DB_TABLES.EXERCISES,id);
    }
  }

  get exercises() {
    return this.collection as Array<IExercise>;
  }
}
