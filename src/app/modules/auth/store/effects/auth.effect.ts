import { Injectable, ErrorHandler } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import {
  AuthActionTypes,
  Login,
  Register,
  LoginSuccess,
  GetUserProfile
} from '../actions/auth.action';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserProfile, UserToken } from '../../models/auth.model';

export interface LoginPayloadCollection {
  sampleArrOfObjects: any[];
}

@Injectable()
export class AuthEffects {
  constructor(private authService: AuthService,
    private route: Router,
    private actions$: Actions) { }

  @Effect({ dispatch: true })
  public loadRegister$: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.LoadRegisterAction),
    mergeMap((action: any) =>
      this.authService.getRegistration().pipe(
        map((collection) => {
          return {
            type: AuthActionTypes.LoadRegisterSuccessAction,
            payload: collection
          };
        }),
        catchError(() => {
          return of({});
        })
      ))
  );

  @Effect({ dispatch: true })
  public register$ = this.actions$.pipe(
    ofType(AuthActionTypes.RegisterAction),
    mergeMap((action: Register) => this.authService.register(action.payload).pipe(
      map((res) => {
        this.authService.isRegistering$.next({isRegistered: true, status: 'success'});
        return {
          type: AuthActionTypes.RegisterSuccessAction,
          payload: res
        };
      }),
      catchError(() => {
        this.authService.isRegistering$.next({isRegistered: false, status: 'failed'});
        return of({
          type: AuthActionTypes.RegisterFailedAction
        });
      })
    ))
  );

  @Effect({ dispatch: true })
  public login$: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.LoginAction),
    mergeMap((action: Login) => this.authService.login(action.payload).pipe(
      map((token: UserToken) => {
        localStorage.setItem('token', JSON.stringify(token));
        return {
          type: AuthActionTypes.GetUserProfile,
          payload: {
            isAlreadyLoggedIn: false
          }
        }
      }),
      catchError(() => {
        this.authService.isLoggingIn$.next({ isLoggingIn: false, status: 'failed' });
        return of({
          type: AuthActionTypes.LoginFailed
        });

      })
    ))
  );

  @Effect({ dispatch: true })
  public getUserProfile$: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.GetUserProfile),
    mergeMap((action: GetUserProfile) => this.authService.getUserProfile().pipe(
      map((userProfile: UserProfile) => {
        return {
          type: AuthActionTypes.LoginSuccessAction,
          payload: {
            userProfile: userProfile,
            isAlreadyLoggedIn: action.payload.isAlreadyLoggedIn
          }
        }
      }),
      catchError(() => {
        return of({});        
      })
    ))
  )

  @Effect({ dispatch: false })
  public loginSuccess$: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.LoginSuccessAction),
    tap((userData: LoginSuccess) => {

      if (!userData.payload.isAlreadyLoggedIn) {
        this.route.navigateByUrl((userData.payload.userProfile.canQa) ? 'inbox' : 'upload');
      }

    }),
    catchError(() => {
      return of({});
    })
  );

  @Effect({ dispatch: false })
  public logout$: Observable<any> = this.actions$.pipe(
    ofType(AuthActionTypes.LogoutAction),
    tap(() => {
      localStorage.removeItem('token');
      this.route.navigateByUrl('login');
    }),
    catchError(() => {
      this.authService.isLoggingIn$.next({isLoggingIn: true});
      return of({});
    })

  );
}
