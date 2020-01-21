import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of, zip, Observable } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { UploadActionTypes, UploadActions, UploadSave, UploadSendToQa } from '../actions/upload.action';
import { Router } from '@angular/router';
import { UploadService } from '../../services/upload.service';
import { UploadFormCollection, Tag, UploadForm } from '../../models/upload.model';

export interface HomePayloadCollection {
  sampleArrOfObjects: any[];
}

@Injectable()
export class UploadEffects {
  constructor(private actions$: Actions,
              private route: Router,
              private uploadService: UploadService) { }

  @Effect()
  public loadHome$: Observable<any> = this.actions$.pipe(
    ofType(UploadActionTypes.LoadHome),
    mergeMap((action: UploadActions) => zip(
      of([{}])
    ).pipe(
      map(([sampleArr]) => {
        return {
          type: UploadActionTypes.LoadHomeSuccess,
          payload: this.formatResponse(sampleArr)
        };
      }),
      catchError(() => {
        return of({});
      })
    ))
  );

  @Effect({ dispatch: false })
  public upload$ = this.actions$.pipe(
    ofType(UploadActionTypes.UploadFile),
    tap(action => {
      localStorage.setItem('uploadedFile', JSON.stringify(action['payload']));
      this.route.navigateByUrl('/upload/image-profile?nbg=true');
    })
  );

  @Effect({ dispatch: true })
  public loadUploadForm$: Observable<any> = this.actions$.pipe(
    ofType(UploadActionTypes.LoadUploadFormAction),
    mergeMap((action: UploadFormCollection) =>
      this.uploadService.getUploadForm().pipe(
        map((collection) => {
          return {
            type: UploadActionTypes.LoadUploadFormSuccessAction,
            payload: collection
          };
        }),
        catchError(() => {
          return of({});
        })
      ))
  );

  @Effect({ dispatch: false })
  public uploadSave$ = this.actions$.pipe(
    ofType(UploadActionTypes.UploadSaveAction),
    mergeMap((action: UploadSave) =>
      this.uploadService.uploadSave(action.payload).pipe(
        map((response: UploadForm) => {
          this.uploadService.uploadSaveSuccessDialog$.next({
            fileName: response.generalInfo.model.fileName,
            sendType: 'save'
          });
        }),
        catchError(() => {
          return of({});
        })
      ))
  );

  @Effect({ dispatch: false })
  public uploadSendToQa$ = this.actions$.pipe(
    ofType(UploadActionTypes.UploadSendToQaAction),
    mergeMap((action: UploadSendToQa) =>
      this.uploadService.uploadSendToQA(action.payload).pipe(
        map(() => {
          this.uploadService.uploadSaveSuccessDialog$.next({
            fileName: action.payload.fileName,
            sendType: 'sendToQa'
          });
        }),
        catchError(() => {
          return of({});
        })
      ))
  );

  private formatResponse(
    sampleArrOfObjects?: any[]): HomePayloadCollection {
    return {
      sampleArrOfObjects
    };
  }

}
