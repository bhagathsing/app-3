import { Injectable } from '@angular/core';
import { Ng2Storage } from './storage';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
} from '@angular/router';
import { DataService } from '../service/DataService';
import { LoginResponse } from '../app.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  //private adminRoles:string[] = ['chargecodeadmin','chargecodeowner','chargecodesponsor'];
  constructor(private authService: DataService, private router: Router, private storage: Ng2Storage) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = route.routeConfig.path;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let metaData: LoginResponse =  this.storage.getSession('user_data');
    if (!metaData) {
      this.router.navigate(['/login']);
      return false;
    }
    let isUser = metaData.employeeRoleName.toLocaleLowerCase();
    if (isUser.indexOf(url) !== -1) {
      return true;
    }else {
      return false;
    }
  }
}
