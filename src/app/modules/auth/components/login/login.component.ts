import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { emailRegex } from 'src/app/shared/validators/email.validator';
import { Store } from '@ngrx/store';
import { AuthState } from '../../store/reducers/auth.reducer';
import { Login } from '../../store/actions/auth.action';
import { ForgotPasswordDialogComponent } from '../forgot-password-dialog/forgot-password-dialog.component';
import { Subject, Observable, of } from 'rxjs';
import { ToastMessage } from 'src/app/models/toast.model';
import { AuthService } from '../../services/auth.service';
import { LoginStatus } from '../../models/auth.model';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public toastTrigger$ = new Subject<ToastMessage>();

  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public authService: AuthService,
    private store: Store<AuthState>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.loginForm = this.formBuilder.group({
      username: [null, Validators.compose([Validators.required, Validators.pattern(emailRegex.email)])],
      password: [null, Validators.required],
      rememberMe: [false, []]
    });
  }

  ngOnInit() {
    this.authService.isLoggingIn$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((loginStatus: LoginStatus) => {
        if (!loginStatus.isLoggingIn && loginStatus.status === 'failed') {
          let toast: ToastMessage = {
            severity: 'error',
            summary: 'Error',
            detail: 'Incorrect login credentials!'
          };
          this.toastTrigger$.next(toast);
        }
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  public onSubmit(): void {
    if ((this.isFormFieldValid('username')) && (this.isFormFieldValid('password'))) {
      this.authService.isLoggingIn$.next({isLoggingIn: true});
      this.store.dispatch(new Login(this.loginForm.value));
    }
  }

  public isFormFieldValid(formField: string): boolean {
    return ((this.loginForm != null) &&
            (this.loginForm.controls != null)  &&
            (this.loginForm.controls[formField.toLowerCase()] != null) &&
            (!this.loginForm.controls[formField.toLowerCase()].invalid)) ? true : false;
  }

  public getErrorMessage(formField: string): string {
    let errorMsg = '';
    switch (formField.toLowerCase()) {
      case 'username':
        if ((this.loginForm != null) && (this.loginForm.controls != null)  &&
            (this.loginForm.controls.username != null)) {
          const controlValue = this.loginForm.controls.username;
          errorMsg = controlValue.hasError('required') ? 'Username required'
                      : controlValue.hasError('pattern') ? 'Invalid username'
                      : '';
        }
        break;
      case 'password':
        if ((this.loginForm != null) && (this.loginForm.controls != null)  &&
            (this.loginForm.controls.password != null)) {
          const controlValue = this.loginForm.controls.password;
          errorMsg = controlValue.hasError('required') ? 'Password required' : '';
        }
        break;
    }

    return errorMsg;
  }

  public openForgotPasswordDialog(): void {
    const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, { width: '481px'});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let toast = {} as ToastMessage;
        toast.severity = 'success';
        toast.summary = 'Success';
        toast.detail = `Email sent (${result})`;
        this.toastTrigger$.next(toast);
      }
    });
  }

  public notImplementedMsg(): void {
    let toast: ToastMessage = {
      severity: 'error',
      summary: 'Error',
      detail: 'Sorry! This feature is not yet implemented'
    };
    this.toastTrigger$.next(toast);
  }
}
