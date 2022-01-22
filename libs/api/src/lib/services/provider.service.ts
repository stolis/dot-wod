import { Inject, inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient, UserCredentials } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { ENVIRONMENT } from '../environment/environemnt.token';
import { Environment } from '../environment/environment.interface';
import { IEquipment } from '../interfaces/dto';

const EQUIPMENT_DB = 'equipment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  dbClient: SupabaseClient;
  private _currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
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
      console.warn('session: ', session);
      if (event == 'SIGNED_IN') {
        this._currentUser.next(session?.user);
        this.loadEquipment();
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

  handleEquipmentChanged() {

  }
}
