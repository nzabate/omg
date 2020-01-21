import { AuthActions, AuthActionTypes } from '../actions/auth.action';
import { MetaReducer } from '@ngrx/store';
import { environment } from 'src/environments/environment.prod';
import { storeFreeze } from 'ngrx-store-freeze';
import { RegisterCollection, UserProfile } from '../../models/auth.model';

export interface AuthState {
  user: UserProfile;
  isLoggedIn: boolean;
  register?: RegisterCollection;
  isRegistered: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  register: null,
  isRegistered: false
};

export function AuthReducer(state: AuthState = initialState, action: AuthActions): AuthState {
  switch (action.type) {

    case AuthActionTypes.LoginSuccessAction:
      return Object.assign({}, state, {
        isLoggedIn: true,
        user: action.payload.userProfile
      });

    case AuthActionTypes.LogoutAction:
        return Object.assign({}, state, {
          isLoggedIn: false,
          user: null
        });

    case AuthActionTypes.RegisterSuccessAction:
      return Object.assign({}, state, {
        isRegistered: action.payload
      });

    case AuthActionTypes.LoadRegisterSuccessAction:
      return Object.assign({}, state, {
        register: action.payload
      });

    default:
      return state;
  }
}

export const getRegisterCollection = (state: AuthState) => state.register;

export const isRegistered = (state: AuthState) => state.isRegistered;

export const getUserProfile = (state: AuthState) => state.user;

export const isLoggedIn = (state: AuthState) => state.isLoggedIn;

export const isUserCanQa = (state: AuthState) => {
  if (state && state.user) {
    return state.user.canQa;
  }
};

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];
