import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailRegex } from 'src/app/shared/validators/email.validator';
import { PasswordValidation } from 'src/app/shared/validators/password.validator';
import { Store, select } from '@ngrx/store';
import { AuthState } from '../../store/reducers/auth.reducer';
import { LoadRegister, Register } from '../../store/actions/auth.action';
import { AuthService } from '../../services/auth.service';
import { Skills, UserInfo, Gender, RegisterCollection, RegisterStatus } from '../../models/auth.model';
import { Observable, Subject } from 'rxjs';
import { registerCollectionSelector, isRegisterSelector } from '../../store/selectors/auth.selector';
import { Router } from '@angular/router';
import { ToastMessage } from 'src/app/models/toast.model';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import {defaultFormat as _rollupMoment} from 'moment';
import { takeUntil } from 'rxjs/operators';

export const dateFormat = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: dateFormat}]
})
export class RegisterComponent implements OnInit, OnDestroy {
  private uploadedImage: File = null;
  private selectedSkills: number[];

  public registerForm: FormGroup;
  public imageDisplayUrl: string;
  public skillsItem: Skills[] = [];
  public genderFiltered: Gender[] = [];
  public register$: Observable<RegisterCollection>;
  public isRegistered$: Observable<boolean>;
  public toastTrigger$ = new Subject<ToastMessage>();
  public maxMsgValidation: string;
  public validateDropdown: boolean = false;

  public presentDate: Date = new Date();
  public maxDate: Date;

  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    public authService: AuthService,
    private loginService: AuthService, 
    private store: Store<AuthState>, 
    private formBuilder: FormBuilder, 
    private route: Router
  ) {

    this.maxDate = new Date(this.presentDate.getFullYear(), this.presentDate.getMonth(), this.presentDate.getDate());

    this.register$ = this.store.pipe(select(registerCollectionSelector));
    this.register$.subscribe((res) => {
      if (res) {
        this.genderFiltered = res.genders.filter(function (item) { return item.key > 0; });
      }
    });

    this.isRegistered$ = this.store.pipe(select(isRegisterSelector));

    this.store.dispatch(new LoadRegister());
    this.registerForm = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      middleName: [null, Validators.compose([Validators.required])],
      lastName: [null, Validators.compose([Validators.required])],
      birthDate: [null, Validators.compose([Validators.required])],
      position: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      office: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.pattern(emailRegex.email)])],
      language: [null],
      skills: [null],
      password: [null, Validators.compose([Validators.required])],
      confirmPassword: [null, Validators.compose([Validators.required])]
    }, {
        validators: PasswordValidation.MatchPassword
      }
    );
  }

  ngOnInit(): void {
    this.authService.isRegistering$
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((registerStatus: RegisterStatus) => {
      if (registerStatus.isRegistered && registerStatus.status === 'success') {
        let toast: ToastMessage = {
          severity: 'success',
          summary: 'Success',
          detail: 'You have successfully registered!'
        }
        this.toastTrigger$.next(toast);

        setTimeout(() => { // TODO: Change implementation
          this.route.navigateByUrl('login');
        }, 2000);

      } else if (!registerStatus.isRegistered && registerStatus.status === 'failed') {
        let toast: ToastMessage = {
          severity: 'error',
          summary: 'Error',
          detail: 'Registration failed!'
        };
        this.toastTrigger$.next(toast);
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  public handleImageChange(event: File): void {
    this.uploadedImage = event;
  }

  public handleSelectChange(event: any): void {
    this.skillsItem = event.value;
    this.selectedSkills = [];
    this.skillsItem.forEach(skill => {
      this.selectedSkills.push(skill.key);
      this.registerForm.get('skills').patchValue(this.selectedSkills);
    });
  }

  public haddleMaxCharEvent(msg: string): void {
    if (msg) {
      this.maxMsgValidation = msg;
    }
  }

  public onSubmit() {
    this.validateDropdown = true;
    if (this.registerForm.valid) {
      this.authService.isRegistering$.next({isRegistered: true});
      if (this.uploadedImage) {
        const formData = new FormData();
        formData.append('file', this.uploadedImage, this.uploadedImage.name);
        this.uploadImage(formData, this.register);
      } else {
        this.register();
      }
    }
  }

  private register = (fileId?: string) => {
    const payload: UserInfo = {
      ...this.registerForm.value,
      positionId: this.registerForm.value.position,
      languageId:  this.registerForm.value.language,
      officeId: this.registerForm.value.office,
      skillIds: this.selectedSkills,
      fileStorageId: fileId,
      hiringDate: this.maxDate.toDateString(),
    };
    this.store.dispatch(new Register(payload));
  }

  private uploadImage(formData: any, callback: any) {
    this.loginService.uploadImage(formData).subscribe((response: any) => {
      callback(response);
    });
  }
}
