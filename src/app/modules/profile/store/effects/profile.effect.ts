import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { LoadProfile, ProfileActionTypes, Update } from '../actions/profile.action';
import { Store } from '@ngrx/store';
import { ProfileState } from '../reducers/profile.reducer';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Injectable()
export class ProfileEffects {
  constructor(private profileService: ProfileService,
    private route: Router,
    private store: Store<ProfileState>,
    private actions$: Actions) { }

  @Effect({ dispatch: true })
  public loadProfile$: Observable<any> = this.actions$.pipe(
    ofType(ProfileActionTypes.LoadProfileAction),
    mergeMap((action: LoadProfile) =>
      this.profileService.getProfile().pipe(
        map((profile) => {
          return {
            type: ProfileActionTypes.LoadProfileSuccessAction,
            payload: profile
          };
        }),
        catchError(() => {
          return of({});
        })
      ))
  );

  @Effect({ dispatch: true })
  public update$ = this.actions$.pipe(
    ofType(ProfileActionTypes.UpdateAction),
    mergeMap((action: Update) => this.profileService.updateProfile(action.payload).pipe(
      map((res) => {
        this.profileService.isUpdateProfileSuccess$.next(true);
        return {
          type: ProfileActionTypes.UpdateSuccessAction,
          payload: res
        };
      }),
      catchError(() => {
        return of({});
      })
    ))
  );

  @Effect({ dispatch: true })
  public updateProfileView$ = this.actions$.pipe(
    ofType(ProfileActionTypes.UpdateProfileViewAction),
    mergeMap(() => this.profileService.getUpdateProfile().pipe(
      map((profileViewUpdateRes: any) => {
        this.profileService.isUpdateProfileSuccess$.next(true);
        return {
          type: ProfileActionTypes.UpdateProfileViewAction,
          payload: profileViewUpdateRes
        }
      }),
      catchError(() => {
        return of({});
      })
    ))
  )
}
