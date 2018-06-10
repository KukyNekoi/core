import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './AuthService';
// import { AuthService } from '../../sign-in/auth.service';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
// import { CrispService } from './crisp.service';

@Injectable()
export class CanActivateUser implements CanActivate {

  constructor(
    private router: Router,
    private auth: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|boolean {

    // this is wrong in so many levels, but works. Why?
    // because if the user is not authenticated, then
    // it returns an error code though the http call
    if (this.auth.getUser() === false) {
      return Observable.of(true);
    } else {
      return Observable.of(false);
    }
  }
}