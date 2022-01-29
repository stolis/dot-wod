import { Inject, Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, UserCredentials } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { ENVIRONMENT } from '../environment/environemnt.token';
import { Environment } from '../environment/environment.interface';
import { IMessage, IRow } from '../interfaces/dto';
import { DB_TABLES } from '../types/ui';

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

  private _user: BehaviorSubject<User> = new BehaviorSubject({} as User);
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
        const user = session?.user;
        if (user){
          this._user.next(user);
        }
      }
      else {
        this._user.next({} as User);
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

  //#region CRUD

  async getJoined(tables: Array<DB_TABLES>, userId?: string) {
    if (userId) {
      return await this.dbClient.from(tables[0])
      .select(`*, ${tables[1]}!inner(*)`)
      .eq(`${tables[1]}.user_id`,userId);
    }
    return await this.dbClient.from(tables[0])
      .select(`*, ${tables[1]}!inner(*)`);
      
  }

  async get(table: DB_TABLES, userId?: string){
    if (userId){
      return await this.dbClient.from(table).select('*').match({ userId });  
    }
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

  //#endregion

  //#region Subscribing

  listenTo(table: DB_TABLES, collection: BehaviorSubject<Array<IRow>>){
    return this.dbClient.from(table).on('*', payload => {
      switch(payload.eventType) {
        case 'DELETE': {
          const deleted: IRow = payload.old;
          collection.next(collection.value.filter( item => item.id !== deleted.id ));
          break;
        }
        case 'INSERT': {
          const inserted: IRow = payload.new;
          collection.next([...collection.value, inserted]);
          break;
        }
        case 'UPDATE': {
          const updated: IRow = payload.new;
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
  
  //#endregion
}
