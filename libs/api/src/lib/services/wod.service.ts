import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProviderService } from '.';
import { Wod, WodExercise, WodResult } from '../classes/wod';
import { IWod, IWodExercise, IWodResult } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';

@Injectable({
  providedIn: 'root'
})
export class WodService {
  public _wods: BehaviorSubject<Array<Wod>> = new BehaviorSubject([] as Array<Wod>);
  public wods$ = this._wods.asObservable;

  public set wods(value: Array<Wod>) {
    this._wods.next(value);
  }

  public get wods(): Array<Wod> {
    return this._wods.value;
  }

  constructor(private api: ProviderService) { }

  async getWods(onlyActive: boolean = false, force: boolean = false) {
    if (this.wods?.length > 0 && !force){
      return this.wods;
    }
    else {
      this.wods = [];
      const userId = this.api.user.id;
      const filters = onlyActive ? { user_id: userId, status: 'Ready' } : { user_id: userId };
      const iWodResults: Array<IWodResult> = (await this.api.getBy(DB_TABLES.WOD_RESULTS, filters)).data as Array<IWodResult>;
      
      if (iWodResults?.length > 0) {
        const iWodIds: Array<number> = iWodResults.map(r=>r.wod_id!);
        const iWods: Array<IWod> = (await this.api.getByMany(DB_TABLES.WODS, iWodIds, 'id'))?.data as Array<IWod>;
        const iWodResultIds: Array<number> = iWodResults.map(r=>r.id!);
        const iWodExercise: Array<IWodExercise> = (await this.api.getByMany(DB_TABLES.WOD_EXERCISES, iWodResultIds, 'wod_result_id'))?.data as Array<IWodExercise>;
        
        if (iWods?.length > 0) {
          iWods.forEach( iWod => {
            const wod = new Wod(iWod); 
            const iWodResult = iWodResults.find( res => res.wod_id === iWod.id);
            if (iWodResult) {
              const wodResult = new WodResult(iWodResult);
              wodResult.exercises = iWodExercise.filter(e=>e.wod_result_id === wodResult.id).map( e => new WodExercise(e));
              wod.results = [...(wod.results ?? []), wodResult];
            }
            this.wods = [...(this.wods ?? []), wod];
          });
          return this.wods;
        }
        else {
          return undefined;  
        }
      }
      else {
        return undefined;
      }
    }
  }

  async addWod(wod: Wod): Promise<boolean | undefined> {
    const added = (await this.api.add(DB_TABLES.WODS,wod.toDTO())).data;
    if (added && added?.length > 0 && added[0].id) {
      wod.id = added[0].id;
      wod.results![0].wod_id = wod.id;
      if (await this.addWodResult(wod.results![0])) {
        this.wods = [...(this.wods ?? []), wod!];
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  async updateWod(wod: Wod): Promise<boolean | undefined> {
    const updated = (await this.api.update(DB_TABLES.WODS,wod.toDTO())).data;
    if (updated && updated?.length > 0 && updated[0].id) {
      return true;
    }
    else {
      return false;
    }
  }

  async removeWod(wod: Wod) {
    const deleted = (await this.api.remove(DB_TABLES.WODS,wod.id!)).data;
    if (deleted && deleted?.length > 0 && deleted[0].id === wod.id) {
      const allExercises = wod.results!.map(r=>r.exercises).reduce((acc, curr) => acc = [...(acc ?? []), ...curr!],[]) as Array<WodExercise>;
      if (await this.removeAllWodExercises(allExercises) && await this.removeWodResult(wod.results!.map(r=>r.toDTO()))) {
          return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

  private async addWodResult(wodResult: WodResult): Promise<boolean | undefined> {
    const added = (await this.api.add(DB_TABLES.WOD_RESULTS,wodResult.toDTO())).data;
    if (added && added?.length > 0 && added[0].id) {
      wodResult.id = added[0].id;
      return true;
    }
    else {
      return false;
    }
  }

  private async removeWodResult(wodResult: Array<IWodResult>) {
    const deleted = (await this.api.removeMany(DB_TABLES.WOD_RESULTS,wodResult.map( r => r.id!))).data;
    if (deleted && deleted?.length === wodResult.length) {
      return true;
    }
    else {
      return false;
    }
  }

  public async addWodExercise(wodExercise: WodExercise): Promise<boolean | undefined> {
    const added = (await this.api.add(DB_TABLES.WOD_EXERCISES,wodExercise.toDTO())).data;
    if (added && added?.length > 0 && added[0].id) {
      wodExercise.id = added[0].id;
      const wodResult = this.wods.find(wod => wod.results?.map(r => r.id).includes(wodExercise.wod_result_id))?.results;
      wodResult![0].exercises = [...(wodResult![0].exercises ?? []),wodExercise];
      return true;
    }
    else {
      return false;
    }
  }

  async updateWodExercise(wodExercise: WodExercise): Promise<boolean | undefined> {
    const updated = (await this.api.update(DB_TABLES.WOD_EXERCISES,wodExercise.toDTO())).data;
    if (updated && updated?.length > 0 && updated[0].id) {
      return true;
    }
    else {
      return false;
    }
  }

  private async removeWodExercise(wodExercise: WodExercise) {
    const deleted = (await this.api.remove(DB_TABLES.WOD_EXERCISES,wodExercise.id!)).data;
    if (deleted && deleted?.length > 0 && deleted[0].id === wodExercise.id) {
      return true;
    }
    else {
      return false;
    }
  }

  private async removeAllWodExercises(wodExercises: Array<WodExercise>) {
    const deleted = (await this.api.removeMany(DB_TABLES.WOD_EXERCISES,wodExercises.map(e => e.id!))).data;
    if (deleted && deleted?.length === wodExercises.length) {
      return true;
    }
    else {
      return false;
    }
  }
}
