import { BehaviorSubject } from "rxjs";
import { DB_TABLES, DOTWOD_EXERCISETYPES, DOTWOD_MUSCLEGROUPS } from "../types/ui";
import { toDTO } from '../functions/helpers';

export interface IRow {
  id?: number;
  user_id?: string;
  name?: string;
  inserted_at?: Date;
  modified_at?: Date;
  is_deleted?: boolean;
  subscriptions?: Array<string>;
  isSubscribed?: boolean;
  toDTO: typeof toDTO;
}

//#region Main Entities

export interface ISchedule extends IRow {
  program?: Array<IProgram>;
  days?: number;
  day?: number;
}

export interface IExercise extends IRow {
  type: Array<DOTWOD_EXERCISETYPES>;
  musclegroups: Array<DOTWOD_MUSCLEGROUPS>;
  exercise_equipment_map: Array<IExerciseEquipment>;
}

export interface IEquipment extends IRow {
  weight?: number;
  height?: number;
}

//#endregion

//#region Child Entities

export interface IProgram {
  day?: number;
  exerciseType?: Array<IExerciseType>;
}

export interface IExerciseType {
  id: number;
  type: DOTWOD_EXERCISETYPES;
}

export interface IExerciseEquipment {
  id: number;
  user_id: string;
  exerciseId: number;
  equipment: Array<IEquipment>;
}

//#endregion

export interface IMessage {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | 'ERROR';
  payload: ISchedule | IEquipment | IExercise;
  errors: any;
}

export abstract class BaseServiceClass {
  abstract db_tables: Array<DB_TABLES>;
  abstract _collection: BehaviorSubject<Array<IRow>>;
  abstract set collection(value: Array<IRow>);
  abstract get collection(): Array<IRow>;
  abstract load:() => void;
  abstract add: (item: IRow) => void;
  abstract update: (item: IRow) => void;
  abstract remove: (id: number) => void;
}
