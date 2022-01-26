import { Inject, inject, Injectable } from '@angular/core';
import { createClient, PostgrestResponse, SupabaseClient, UserCredentials } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { ENVIRONMENT } from '../environment/environemnt.token';
import { Environment } from '../environment/environment.interface';
import { IEquipment, ISchedule } from '../interfaces/dto';

const EQUIPMENT_DB = 'equipment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  dbClient: SupabaseClient;

  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);

  private _schedules: BehaviorSubject<Array<ISchedule>> = new BehaviorSubject([] as Array<ISchedule>);
  public schedules$ = this._schedules.asObservable;

  public set schedules(value: Array<ISchedule>) {
    this._schedules.next(value);
  }

  public get schedules(): Array<ISchedule> {
    return this._schedules.value;
  }

  private _equipment: BehaviorSubject<Array<IEquipment>> = new BehaviorSubject([] as Array<IEquipment>);
  public equipment$ = this._equipment.asObservable;

  public set equipment(value: Array<IEquipment>) {
    this._equipment.next(value);
  }

  public get equipment(): Array<IEquipment> {
    return this._equipment.value;
  }

  constructor(@Inject(ENVIRONMENT) private env: Environment) { 
    this.dbClient = createClient(env.apiURL,env.apiKey, {
      autoRefreshToken: true,
      persistSession: true
    });
    this.dbClient.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN') {
        this._currentUser.next(session?.user);
        this.loadEquipment();
        this.onEquipmentChanged();
      }
      else {
        this._currentUser.next(false);
      }
    });
  }

  loadUser() {

  }
  
  async signUp(credentials: UserCredentials) {
    return new Promise(async (resolve, reject) => {
      const { error, session } = await this.dbClient.auth.signUp(credentials); 
      if (error) {
        reject(error);
      } 
      else {
        resolve(session);
      }
    });
  }

  async signIn(credentials: UserCredentials) {
    return new Promise(async (resolve, reject) => {
      const { error, session } = await this.dbClient.auth.signIn(credentials); 
      if (error) {
        reject(error);
      } 
      else {
        resolve(session);
      }
    });
  }

  async signOut() {
    await this.dbClient.auth.signOut();
    this.dbClient.removeAllSubscriptions();
  }

  onEquipmentChanged() {
    this.dbClient.from(EQUIPMENT_DB).on('*', payload => {
     switch(payload.eventType) {
       case 'DELETE': {
         const deleted: IEquipment = payload.old;
         this.equipment = this.equipment.filter( eq => eq.id !== deleted.id );
         break;
       }
       case 'INSERT': {
         const inserted: IEquipment = payload.new;
         this.equipment = [...this.equipment, inserted];
         break;
       }
       case 'UPDATE': {
         const updated: IEquipment = payload.new;
         this.equipment = this.equipment.map(eq => {
           if (eq.id === updated.id){
             eq = updated;
           }
           return eq;
         });
         break;
       }

     }
    }).subscribe();             
  } 

  async loadEquipment() {
    const query = await this.dbClient.from(EQUIPMENT_DB).select('*');
    console.log('query: ', query);
    this._equipment.next(query.data as Array<IEquipment>);
  }

  async addEquipment(equipment: IEquipment){
    const userId = this.dbClient.auth.user()?.id;
    const equipmentExists = this.equipment.some(eq => eq.equipment_name === equipment.equipment_name && (eq.weight === equipment.weight || eq.height === equipment.height));
    if (userId && !equipmentExists){
      equipment.user_id = userId;
      const result = await this.dbClient.from(EQUIPMENT_DB).insert(equipment);
    }
  }

  async removeEquipment(id: number) {
    await this.dbClient.from(EQUIPMENT_DB).delete().match({ id });
    /* .then( (resp: PostgrestResponse<any>) => { 
      if (!resp.error){
        this.equipment = this.equipment.filter( eq => eq.id !== id);
      }
      else {
        console.error(resp.error);
      }
    }); */
  }

  async updateEquipment(equipment: IEquipment) {
    const id = equipment.id;
    const equipment_name = equipment.equipment_name;
    const weight = equipment.weight;
    const height = equipment.height;
    const modified_at = new Date();
    await this.dbClient.from(EQUIPMENT_DB)
      .update({ equipment_name, weight, height, modified_at })
      .match({ id })
  }

  
}
