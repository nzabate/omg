import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../modules/auth/store/reducers/auth.reducer';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isLoggedInSelector } from '../modules/auth/store/selectors/auth.selector';
import { AppState } from '../store/reducers/app.reducer';
import { Logout } from '../modules/auth/store/actions/auth.action';

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  public isLoggedIn$: Observable<boolean>;

  constructor (
    private router: Router, 
    private store: Store<AppState>
  ) { }

  canActivate (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const token = JSON.parse(localStorage.getItem('token'));

    if (!!token && token !== '') {
      return of(true);
    } else {
      this.store.dispatch(new Logout());
      return of(false);
    }

  }
}
