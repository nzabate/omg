import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailRegex } from 'src/app/shared/validators/email.validator';
import { Store, select } from '@ngrx/store';
import { ProfileState } from '../../store/reducers/profile.reducer';
import { AuthService } from '../../../auth/services/auth.service';
import { Skills, UserInfo, RegisterCollection } from '../../../auth/models/auth.model';
import { Observable, Subject } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { profileSelector } from '../../store/selectors/profile.selector';
import { ToastMessage } from 'src/app/models/toast.model';
import { registerCollectionSelector } from '../../../auth/store/selectors/auth.selector';
import { Update } from '../../store/actions/profile.action';
import * as _moment from 'moment';
import { MatDialog, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { dateFormat } from 'src/app/modules/auth/components/register/register.component';
import { ProfileService } from '../../services/profile.service';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: dateFormat}]
})

export class ProfileEditComponent implements OnInit, OnDestroy {
  private uploadedImage: File = null;
  private selectedSkills: number[];

  public profileForm: FormGroup;
  public imageDisplayUrl: string;
  public skillsItem: Skills[] = [];
  public register$: Observable<RegisterCollection>;
  public profile$: Observable<UserInfo>;
  public isUpdated$: Observable<boolean>;
  public toastTrigger$ = new Subject<ToastMessage>();
  public maxMsgValidation: string;
  public presentDate: Date = new Date();
  public maxDate: any;
  public styles = {
    'padding.px': '50',
    'min-width.px': '950',
  };

  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private loginService: AuthService,
    private store: Store<ProfileState>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private profileService: ProfileService) {
    this.profileForm = this.formBuilder.group({
      firstName: [null, Validators.compose([Validators.required])],
      middleName: [null],
      lastName: [null, Validators.compose([Validators.required])],
      birthDate: [null],
      position: [null, Validators.compose([Validators.required])],
      gender: [null, Validators.compose([Validators.required])],
      office: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.pattern(emailRegex.email)])],
      language: [null],
      skills: [null],
      fileStorageId: [null],
    });

    this.maxDate = new Date(this.presentDate.getFullYear(), 12, 0);
    
    this.register$ = this.store.pipe(select(registerCollectionSelector));
    this.profile$ = this.store.pipe(select(profileSelector));
    this.fetchUpdateProfileDetails();
  }

  ngOnInit(): void {
    this.profileService.isUpdateProfileSuccess$
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((isUpdateProfileSuccess: boolean) => {
      if (isUpdateProfileSuccess) {
        this.dialog.open(ConfirmDialogComponent, {
          width: '480px',
        });
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
      this.profileForm.get('skills').patchValue(this.selectedSkills);
    });
  }

  public haddleMaxCharEvent(msg: string): void {
    if (msg) {
      this.maxMsgValidation = msg;
    }
  }

  public onSubmit() {
    if (this.uploadedImage) {
      const formData = new FormData();
      formData.append('file', this.uploadedImage, this.uploadedImage.name);
      this.uploadImage(formData, this.register);
    } else {
      this.register();
    }
  }

  public fetchUpdateProfileDetails(): void {
    this.profileService.getUpdateProfile().pipe(take(1)).subscribe((res: any) => {
      if (res) {
        const birthDateToLocal = _moment(_moment.utc(res.model.birthDate).toDate()).local().format('YYYY-MM-DDTHH:mm:ss');
        this.imageDisplayUrl = res.model.profilePicture.absoluteUri;
        this.profileForm.get('firstName').patchValue(res.model.firstName);
        this.profileForm.get('middleName').patchValue(res.model.middleName);
        this.profileForm.get('lastName').patchValue(res.model.lastName);
        this.profileForm.get('birthDate').patchValue(birthDateToLocal);
        this.profileForm.get('email').patchValue(res.model.email);
        this.profileForm.get('position').patchValue(res.model.position.key);
        this.profileForm.get('gender').patchValue(res.model.gender.key);
        this.profileForm.get('office').patchValue(res.model.office.key);
        this.profileForm.get('language').patchValue(1); // temporary
        this.profileForm.get('fileStorageId').patchValue(res.model.profilePicture.fileStorageId);
        this.profileForm.get('skills').patchValue(res.model.skills.map(skill => {
          return {
            key: skill.id
          }
        }));
      }
    });
  }
  
  private register = (fileId?: string) => {
    const payload: any = {
      firstName: this.profileForm.value.firstName,
      middleName: this.profileForm.value.middleName,
      lastName: this.profileForm.value.lastName,
      birthDate: this.profileForm.value.birthDate,
      officeId: this.profileForm.value.office,
      positionId: this.profileForm.value.position,
      gender: this.profileForm.value.gender,
      email: this.profileForm.value.email,
      fileStorageKey: fileId || this.profileForm.value.fileStorageId,
      skillIds: this.profileForm.value.skills,
    };
    this.store.dispatch(new Update(payload));
  }

  private uploadImage(formData: any, callback: any) {
    this.loginService.uploadImage(formData).subscribe((response: any) => {
      callback(response);
    });
  }
}
