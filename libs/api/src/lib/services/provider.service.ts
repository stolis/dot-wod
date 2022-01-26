import { Inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, UserCredentials } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { ENVIRONMENT } from '../environment/environemnt.token';
import { Environment } from '../environment/environment.interface';
import { IEquipment, IMessage, IRow } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';

const EQUIPMENT_DB = 'equipment';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  dbClient: SupabaseClient;

  //#region Properties

  private _message: BehaviorSubject<IMessage> = new BehaviorSubject({} as IMessage);
  public message$ = this._message.asObservable;

  public set message(value: IMessage){
    this._message.next(value);
  }

  public get message() {
    return this._message.value;
  }

  private _user: BehaviorSubject<any> = new BehaviorSubject(null);
  public user$ = this._user.asObservable;

  public set user(value: User) {
    this._user.next(value);
  }

  public get user() {
    return this._user.value;
  }

  //#endregion

  constructor(@Inject(ENVIRONMENT) private env: Environment) { 
    this.dbClient = createClient(env.apiURL,env.apiKey, {
      autoRefreshToken: true,
      persistSession: true
    });
    this.dbClient.auth.onAuthStateChange((event, session) => {
      if (event == 'SIGNED_IN') {
        this._user.next(session?.user);
      }
      else {
        this._user.next(false);
      }
    });
  }

  //#region User/Authentication

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

  //#endregion


  async get(table: DB_TABLES){
    return await this.dbClient.from(table).select('*');
  }

  async add(table: DB_TABLES, item: any){
    const userId = this.dbClient.auth.user()?.id;
    item.user_id = userId;
    return await this.dbClient.from(table).insert(item);
  }

  async update(table: DB_TABLES, item: any){
    const id = item.id;
    return await this.dbClient.from(table).update(item).match({ id });
  }

  async remove(table: DB_TABLES, id: number){
    return await this.dbClient.from(table).delete().match({ id });
  }

  listenTo(table: DB_TABLES, collection: BehaviorSubject<Array<IRow>>){
    this.dbClient.from(table).on('*', payload => { 
      switch(payload.eventType) {
        case 'DELETE': {
          const deleted: IEquipment = payload.old;
          collection.next(collection.value.filter( item => item.id !== deleted.id ));
          break;
        }
        case 'INSERT': {
          const inserted: IEquipment = payload.new;
          collection.next([...collection.value, inserted]);
          break;
        }
        case 'UPDATE': {
          const updated: IEquipment = payload.new;
          collection.next(collection.value.map(item => {
            if (item.id === updated.id){
              item = updated;
            }
            return item;
          }));
          break;
        }
      }
    }).subscribe();
  }
  
}
