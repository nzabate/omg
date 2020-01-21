import { Injectable } from '@angular/core';
import { Effect } from '@ngrx/effects';
import { GetUserProfile, Logout } from 'src/app/modules/auth/store/actions/auth.action';
import { Router } from '@angular/router';
import { of, asyncScheduler, defer } from 'rxjs';
import { AppState } from '../reducers/app.reducer';
import { Store } from '@ngrx/store';

export interface AppPayloadCollection {
  sampleArrOfObjects: any;
}

@Injectable()
export class AppEffects {
  constructor(
    private route: Router,
    private store: Store<AppState>
  ) { }

  @Effect()
  init$ = defer(() => {

    const token = JSON.parse(localStorage.getItem('token'));

    if (!!token) {
      return of(new GetUserProfile({ isAlreadyLoggedIn: true }), asyncScheduler);
    } else {
      this.store.dispatch(new Logout());
    }

  });

  // @Effect()
  // public loadApp$: Observable<any> = this.actions$.pipe(
  //   ofType(AppActionTypes.LoadApp),
  //   mergeMap((action: AppActions) => of([1, 2, 3]).pipe(
  //     map(([sampleArr]) => {
  //       
  //       return {
  //         type: AppActionTypes.LoadAppSuccess,
  //         payload: this.formatResponse(sampleArr)
  //       };
  //     }),
  //     catchError(() => {
  //       return of({});
  //     })
  //   ))
  // );

  // private formatResponse(
  //   sampleArrOfObjects?: any): AppPayloadCollection {
  //   return {
  //     sampleArrOfObjects
  //   };
  // }
}
