import { UploadActions, UploadActionTypes } from '../actions/upload.action';
import { MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { storeFreeze } from 'ngrx-store-freeze';
import { UploadFormCollection, Tag } from '../../models/upload.model';

export interface UploadState {
  uploadForm?: UploadFormCollection;
  uploadFormSuccess?: any;
}

const initialState: UploadState = {
  uploadForm: null,
  uploadFormSuccess: null
};

export function UploadReducer(state: UploadState = initialState, action: UploadActions): UploadState {
  switch (action.type) {

    case UploadActionTypes.UploadFile:
      return Object.assign({}, state);

    case UploadActionTypes.LoadUploadFormSuccessAction:
      return Object.assign({}, state, {
        uploadForm: action.payload
      });

    default:
      return state;
  }
}

export const getUploadFormCollection = (state: UploadState) => {
  if (state && state.uploadForm) {
    return state.uploadForm;
  }
}

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];
