import { DOTWOD_EXERCISETYPES } from "../types/ui";

export interface ISchedule extends IModification {
  id?: number;
  user_id?: string;
  schedule_name?: string;
  program?: Array<IProgram>;
  days?: number;
  day?: number;
  is_active?: boolean;
}

export interface IProgram {
  day?: number;
  exerciseType?: DOTWOD_EXERCISETYPES;
}

export interface IEquipment extends IModification {
  id?: number;
  user_id?: string;
  equipment_name?: string;
  weight?: number;
  height?: number;
}
  
export interface IModification {
  inserted_at?: Date;
  modified_at?: Date;
  is_deleted?: boolean;
}