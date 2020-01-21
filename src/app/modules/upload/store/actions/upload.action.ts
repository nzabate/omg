import { Action } from '@ngrx/store';
import { UploadInfo, UploadFormCollection, Tag } from '../../models/upload.model';

export enum UploadActionTypes {
  LoadHome = '[Home] Load Home',
  LoadHomeSuccess = '[Home] Load Home (success)',
  UploadFile = '[Home] Upload File (change)',
  LoadUploadFormAction = '[Home] Load Upload Form',
  LoadUploadFormSuccessAction = '[Home] Load Upload Form Success',
  UploadSaveAction = '[Home] Upload Save Action',
  UploadSaveSuccessAction = '[Home] Upload Save Success',
  UploadSendToQaAction = '[Home] Upload Send To Qa Action'
}

export class LoadHome implements Action {
  readonly type = UploadActionTypes.LoadHome;
}

export class LoadHomeSuccess implements Action {
  readonly type = UploadActionTypes.LoadHomeSuccess;

  constructor(public payload: any) { }
}

export class UploadFile implements Action {
  readonly type = UploadActionTypes.UploadFile;
  constructor(public payload: { name: string, imgData: any }) { }
}

export class LoadUploadForm implements Action {
  readonly type = UploadActionTypes.LoadUploadFormAction;
}

export class LoadUploadFormSuccess implements Action {
  readonly type = UploadActionTypes.LoadUploadFormSuccessAction;
  constructor(public payload: UploadFormCollection) {}
}

export class UploadSave implements Action {
  readonly type = UploadActionTypes.UploadSaveAction;
  constructor(public payload: UploadInfo) {}
}

export class UploadSaveSuccess implements Action {
  readonly type = UploadActionTypes.UploadSaveSuccessAction;
  constructor(public payload: any) {}
}

export class UploadSendToQa implements Action {
  readonly type = UploadActionTypes.UploadSendToQaAction;
  constructor(public payload: UploadInfo) {}
}

export type UploadActions 
                          = LoadHome 
                          | LoadHomeSuccess 
                          | UploadFile 
                          | LoadUploadForm 
                          | LoadUploadFormSuccess 
                          | UploadSave 
                          | UploadSaveSuccess 
                          | UploadSendToQa;
