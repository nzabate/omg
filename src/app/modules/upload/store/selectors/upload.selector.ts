import { createSelector } from '@ngrx/store';
import * as fromUpload from '../reducers/upload.reducer';

export const uploadState = state => state.upload;

export const uploadFormCollectionSelector = createSelector(
  uploadState,
  fromUpload.getUploadFormCollection
);
