import { Injectable } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { UserToken, LoginInfo, UserInfo, Registration, UserProfile, LoginStatus, RegisterStatus } from '../models/auth.model';

@Injectable()
export class AuthService extends BaseService {

  public isLoggingIn$: Subject<LoginStatus> = new Subject<LoginStatus>();
  public isRegistering$: Subject<RegisterStatus> = new Subject<RegisterStatus>();

  constructor(http: HttpClient) {
    super(http);
  }

  public login(payload: LoginInfo): Observable<UserToken> {
    return this.post('/api/Authentication', payload);
  }

  public register(payload: UserInfo): Observable<UserInfo> {
    return this.post('/api/Registration', payload);
  }

  public getRegistration(): Observable<Registration> {
    return this.get('/api/Registration');
  }

  public uploadImage(formData: FormData): Observable<any> {
    return this.upload('/api/File', formData);
  }

  public getUserProfile(): Observable<UserProfile> {
    return this.get('/api/Profile');
  }

  private handleError(): any {
    return of('Error');
  }
}
