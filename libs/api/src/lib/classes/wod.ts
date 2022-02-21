import { IWod, IWodResult, IWodExercise } from "../interfaces/dto";
import { DOTWOD_EXERCISETYPES, DOTWOD_STATUS } from "../types/ui";

export class Wod implements IWod {
    id?: number;
    importId?: number;
    name?: string;
    schedule?: Array<DOTWOD_EXERCISETYPES>;
    formatId?: number;
    timecap?: number;
    rounds?: number;
    results?: Array<WodResult>;
    toDTO(): IWod {
      return {
        id: this.id,
        importId: this.importId,
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
        this.importId = iwod.importId;
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
    exercises?: Array<IWodExercise>;
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