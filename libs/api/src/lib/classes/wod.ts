import { IWod, IWodResult, IWodExercise } from "../interfaces/dto";
import { DOTWOD_EXERCISEROLE, DOTWOD_EXERCISETYPES, DOTWOD_STATUS } from "../types/ui";

export class Wod implements IWod {
    id?: number;
    imported_id?: number;
    name?: string;
    schedule?: Array<DOTWOD_EXERCISETYPES>;
    formatId?: number;
    timecap?: number;
    rounds?: number;
    results?: Array<WodResult>;
    toDTO(): IWod {
      return {
        id: this.id,
        imported_id: this.imported_id,
        name: this.name,
        schedule: this.schedule,
        formatId: this.formatId,
        timecap: this.timecap,
        rounds: this.rounds
      };
    }
  
    constructor(iwod?: IWod) {
      if (iwod) {
        this.id = iwod.id;
        this.imported_id = iwod.imported_id;
        this.name = iwod.name;
        this.schedule = iwod.schedule;
        this.formatId = iwod.formatId;
        this.timecap = iwod.timecap;
        this.rounds = iwod.rounds;
      }
    }
  }
  
  export class WodResult implements IWodResult {
    id?:number;
    wod_id?:number;
    user_id?: string;
    started_at?: Date;
    finished_at?: Date;
    status?: DOTWOD_STATUS;
    duration?: number;
    exercises?: Array<WodExercise>;
    toDTO(): IWodResult {
      return {
        id: this.id,
        wod_id: this.wod_id,
        user_id: this.user_id,
        started_at: this.started_at,
        finished_at: this.finished_at,
        status: this.status,
        duration: this.duration
      };
    }
    constructor(iWodResult?: IWodResult){
      if (iWodResult){
        this.id = iWodResult.id;
        this.wod_id = iWodResult.wod_id;
        this.user_id = iWodResult.user_id;
        this.started_at = iWodResult.started_at;
        this.finished_at = iWodResult.finished_at;
        this.status = iWodResult.status;
        this.duration = iWodResult.duration;    
      }
    }
  }

  export class WodExercise implements IWodExercise {
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
    toDTO(): IWodExercise {
        return {
            id: this.id,
            wod_result_id: this.wod_result_id,
            exerciseId: this.exerciseId,
            role: this.role,
            equipmentId: this.equipmentId,
            equipmentQty: this.equipmentQty,
            goal: this.goal,
            rounds: this.rounds,
            achievedOffset: this.achievedOffset,
            achieved: this.achieved
        }
    }
    constructor(iWodExercise?: IWodExercise) {
        if (iWodExercise){
            this.id = iWodExercise.id;
            this.wod_result_id = iWodExercise.wod_result_id;
            this.exerciseId = iWodExercise.exerciseId;
            this.role = iWodExercise.role;
            this.equipmentId = iWodExercise.equipmentId;
            this.equipmentQty = iWodExercise.equipmentQty;
            this.goal = iWodExercise.goal;
            this.rounds = iWodExercise.rounds;
            this.achievedOffset = iWodExercise.achievedOffset;
            this.achieved = iWodExercise.achieved;
        }
    }
  }