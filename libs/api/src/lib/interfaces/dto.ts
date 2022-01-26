import { DOTWOD_EXERCISETYPES } from "../types/ui";

export interface ISchedule extends IRow {
  schedule_name?: string;
  program?: Array<IProgram>;
  days?: number;
  day?: number;
  is_active?: boolean;
}

export interface IProgram {
  day?: number;
  exerciseType?: Array<DOTWOD_EXERCISETYPES>;
}

export interface IEquipment extends IRow {
  equipment_name?: string;
  weight?: number;
  height?: number;
}
  
export interface IRow {
  id?: number;
  user_id?: string;
  inserted_at?: Date;
  modified_at?: Date;
  is_deleted?: boolean;
}

export interface IMessage {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | 'ERROR';
  payload: ISchedule | IEquipment;
  errors: any;
}