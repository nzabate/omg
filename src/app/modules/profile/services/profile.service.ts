import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { UserInfo } from '../../auth/models/auth.model';
import { UpdateProfileInfo } from '../models/profile.model';

@Injectable()
export class ProfileService extends BaseService {

  public isUpdateProfileSuccess$: Subject<boolean> = new Subject<boolean>();

  constructor(http: HttpClient) {
    super(http);
  }

  public getProfile(): Observable<UserInfo> {
    return this.get('/api/Profile/form');
  }

  public updateProfile(payload: UpdateProfileInfo): Observable<any> {
    return this.put('/api/Profile/form', payload);
  }

  public getUpdateProfile(): Observable<any> {
    return this.get('/api/Profile/form');
  }

  private handleError(): any {
    return of('Error');
  }
}
