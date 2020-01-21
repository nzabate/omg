import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UploadFormCollection, UploadSaveDialog, UploadForm, UploadFormModel, SendMessage, UpdateMainFile, DeleteReference, AddNewReference } from '../models/upload.model';

@Injectable()
export class UploadService extends BaseService {

  public isUploadFormSubmitted$: Subject<boolean> = new Subject<boolean>();
  public uploadSaveSuccessDialog$: Subject<UploadSaveDialog> = new Subject<UploadSaveDialog>();

  constructor(http: HttpClient) {
    super(http);
  }

  public getUploadForm(): Observable<UploadFormCollection> {
    return this.get('/api/UploadForm');
  }

  public fetchUploadInfo(resourceId: number): Observable<UploadForm> {
    return this.get(`/api/UploadForm/${resourceId}`);
  }

  public addNewTag(newTag: string): Observable<any> {
    return this.post(`/api/Tag?label=${newTag}`, newTag);
  }

  public uploadMainFile(formData: FormData): Observable<any> {
    return this.upload('/api/File', formData);
  }

  public downloadAllFiles(files: string[]): Observable<any> {
    return this.download('/api/File', files);
  }

  public uploadSources(formData: FormData): Observable<any> {
    return this.upload('/api/File/multiple', formData);
  }

  public addNewReference(newReferenceData: AddNewReference): Observable<{}> {
    return this.post('/api/ReferenceFile', newReferenceData);
  }

  public deleteReference(deleteReference: DeleteReference) {
    return this.delete('/api/ReferenceFile', deleteReference);
  }

  // TODO: Create or assign correct type annotation
  public uploadSave(payload: any): Observable<any> {
    return this.post('/api/UploadForm', payload);
  }

  // TODO: Create or assign correct type annotation
  public uploadSendToQA(payload: any): Observable<any> {
    return this.post('/api/UploadForm/sendToQa', payload);
  }

  public updateMainFile(updatedFileData: UpdateMainFile): Observable<any> {
    return this.put('/api/MainFile', updatedFileData);
  }

  public sendMessage(message: SendMessage): Observable<{}> {
    return this.post('/api/Notes', message);
  }

  public getMessage(resourceId: number): Observable<any> {
    return this.get(`/api/Notes/${resourceId}`);
  }

  public getImageReviewResource(resourceId: number): Observable<any> {
    return this.get(`/api/ReviewResource/${resourceId}`);
  }

  public updateUploadForm(uploadForm: UploadFormModel): Observable<any> {
    return this.put('/api/UploadForm', uploadForm);
  }

  public declineImageReview(resourceId: number): Observable<{}> {
    return this.patch(`/api/ReviewAction/decline/${resourceId}`, {});
  }

  public approveImageReview(resourceId: number): Observable<{}> {
    return this.patch(`/api/ReviewAction/approve/${resourceId}`, {});
  }
}

