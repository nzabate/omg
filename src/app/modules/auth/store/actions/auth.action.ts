import { Action } from '@ngrx/store';
import { LoginInfo, UserInfo, UserProfile } from '../../models/auth.model';

export enum AuthActionTypes {
  LoginAction = '[Login] Load Login',
  LoginSuccessAction = '[Login] Load Login Success',
  GetUserProfile = '[Login] Get User Profile',
  LoginFailed = '[Login] Login Failed',
  RegisterAction = '[Register] Register',
  RegisterSuccessAction = '[Register] Register Success',
  RegisterFailedAction = '[Register] Register Failed',
  LoadRegisterAction = '[Register] Load Register',
  LoadRegisterSuccessAction = '[Register] Load Register Success',
  LogoutAction = '[Logout] Load Logout'
}

export class Login implements Action {
  readonly type = AuthActionTypes.LoginAction;
  constructor(public payload: LoginInfo) { }
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccessAction;
  constructor(public payload: { userProfile: UserProfile, isAlreadyLoggedIn: boolean }) { }
}

export class GetUserProfile implements Action {
  readonly type = AuthActionTypes.GetUserProfile;
  constructor(public payload: { isAlreadyLoggedIn: boolean }) { }
}

export class LoginFailed implements Action {
  readonly type = AuthActionTypes.LoginFailed;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export class Register implements Action {
  readonly type = AuthActionTypes.RegisterAction;
  constructor(public payload: UserInfo) { }
}

export class RegisterSuccess implements Action {
  readonly type = AuthActionTypes.RegisterSuccessAction;
  constructor(public payload: any) { }
}

export class LoadRegister implements Action {
  readonly type = AuthActionTypes.LoadRegisterAction;
}

export class LoadRegisterSuccess implements Action {
  readonly type = AuthActionTypes.LoadRegisterSuccessAction;
  constructor(public payload: Register) {}
}

export type AuthActions = Login | GetUserProfile | LoginSuccess | Logout | Register | RegisterSuccess | LoadRegister | LoadRegisterSuccess;

