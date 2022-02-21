import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProviderService } from '.';
import { Wod, WodResult } from '../classes/wod';
import { IWod, IWodResult } from '../interfaces/dto';
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

  async getWods(onlyActive: boolean = false) {
    if (this.wods?.length > 0){
      return this.wods;
    }
    else {
      const userId = this.api.user.id;
      const filters = onlyActive ? { user_id: userId, status: 'Ready' } : { user_id: userId };
  
      const iWodResults = (await this.api.getBy(DB_TABLES.WOD_RESULTS, filters)).data as Array<IWodResult>;
  
      if (iWodResults?.length > 0) {
        const iWods = (await this.api.getBy(DB_TABLES.WODS, { id: iWodResults[0].wod_id })).data as Array<IWodResult>;
        if (iWods?.length > 0) {
          iWods.forEach( iWod => {
            const wod = new Wod(iWod); 
            const iWodResult = iWodResults.find( res => res.wod_id === iWod.id);
            if (iWodResult) {
              wod.results = [...(wod.results ?? []), new WodResult(iWodResult)];
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
      const addedResultId = await this.addWodResult(wod.results![0]);
      if (addedResultId) {
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

  async removeWod(wod: Wod) {
    const deleted = (await this.api.remove(DB_TABLES.WODS,wod.id!)).data;
    if (deleted && deleted?.length > 0 && deleted[0].id === wod.id) {
      const deleteResult = await this.removeWodResult(wod.results!.map(r=>r.toDTO()));
      if (deleteResult === wod.results!.length){
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

  async addWodResult(wodResult: WodResult): Promise<number | undefined> {
    const added = (await this.api.add(DB_TABLES.WOD_RESULTS,wodResult.toDTO())).data;
    if (added && added?.length > 0 && added[0].id) {
      wodResult.id = added[0].id;
      return added[0].id;
    }
    else {
      console.error('Item was not added!', added);
    }
    return undefined;
  }

  async removeWodResult(wodResult: Array<IWodResult>) {
    const deleted = (await this.api.removeMany(DB_TABLES.WOD_RESULTS,wodResult.map( r => r.id!))).data;
    if (deleted && deleted?.length === wodResult.length) {
      return deleted.length;
    }
    else {
      console.error('Item was not deleted!', deleted);
    }
    return undefined;
  }

  /* get wods() {
    return this.collection as Array<IWod>;
  } */
}
