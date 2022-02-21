import { BehaviorSubject } from "rxjs";
import { DB_TABLES, DOTWOD_ALERT, DOTWOD_EXERCISEGAUGE, DOTWOD_EXERCISEROLE, DOTWOD_EXERCISETYPES, DOTWOD_LOGBY, DOTWOD_MUSCLEGROUPS, DOTWOD_STATUS, DOTWOD_TIMEDIRECTION } from "../types/ui";
import { toDTO } from '../functions/helpers';

//#region Wod

export interface IWod {
  id?: number;
  importId?: number;
  name?: string;
  schedule?: Array<DOTWOD_EXERCISETYPES>;
  formatId?: number;
  timecap?: number;
  rounds?: number;
}

export interface IWodResult {
  id?:number;
  wod_id?:number;
  user_id?: string;
  started_at?: Date;
  finished_at?: Date;
  status?: DOTWOD_STATUS;
  duration?: number;
}

export interface IWodExercise {
  id?: number;
  wod_result_id?: number;
  exerciseId?: number;
  role?: DOTWOD_EXERCISEROLE;
  equipmentId?: number;
  equipmentQty?: number;
  goal?: number;
  rounds?: number;
  achievedOffset?: number;
  achieved?: number;
}

//#endregion

//#region Availables

export interface IRow {
  id?: number;
  user_id?: string;
  name?: string;
  subscriptions?: Array<string>;
  isSubscribed?: boolean;
  toDTO: typeof toDTO;
}

export interface IAvailableSchedule extends IRow {
  program?: Array<IProgram>;
  days?: number;
  day?: number;
}

export interface IAvailableFormat extends IRow {
  time_direction?: DOTWOD_TIMEDIRECTION;
  log_by?: DOTWOD_LOGBY;
}

export interface IAvailableExercise extends IRow {
  type: Array<DOTWOD_EXERCISETYPES>;
  musclegroups: Array<DOTWOD_MUSCLEGROUPS>;
  gauge: DOTWOD_EXERCISEGAUGE;
  exercise_equipment_map: Array<IAvailableExerciseEquipment>;
}

export interface IAvailableEquipment extends IRow {
  weight?: number;
  height?: number;
}

export interface IAvailableExerciseEquipment {
  id?: number;
  user_id?: string;
  exerciseId?: number;
  equipment?: Array<number>;
}

//#endregion

//#region Child Entities

export interface IProgram {
  day?: number;
  exerciseType?: Array<IExerciseType>;
}

export interface IAlert {
  type?: DOTWOD_ALERT;
  interval?: number;
  duration?: number;
}

export interface IExerciseType {
  id: number;
  type: DOTWOD_EXERCISETYPES;
}

//#endregion

export interface IMessage {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | 'ERROR';
  payload: IAvailableSchedule | IAvailableEquipment | IAvailableExercise;
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
