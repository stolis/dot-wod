import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ProviderService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public api: ProviderService, public router: Router) { }

  canActivate(): boolean {
      if (!this.api.user?.id){
        const userFromSession = this.api.dbClient.auth.user();
        if (userFromSession){
          this.api.user = userFromSession;
          return true;
        }
        else {
          this.router.navigateByUrl('/tabs/login');
        }
        return false;
      }
      return true;
  }
}
