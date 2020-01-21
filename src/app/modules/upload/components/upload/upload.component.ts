import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { UploadState } from '../../store/reducers/upload.reducer';
import { UtilityService } from '../../../../services/utility.service';
import { Subject, Observable, of } from 'rxjs';
import { ToastMessage } from 'src/app/models/toast.model';
import { LocalFile, UploadFormCollection, Tag, UploadInfo, QA, QAForm, UploadSaveDialog } from '../../models/upload.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, take, map } from 'rxjs/operators';
import { UploadService } from '../../services/upload.service';
import { MatDialog, MatSelectChange } from '@angular/material';
import { AddSourceDialogComponent } from '../add-source-dialog/add-source-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { LoadUploadForm, UploadSave, UploadSendToQa } from '../../store/actions/upload.action';
import { uploadFormCollectionSelector } from '../../store/selectors/upload.selector';
import { UploadNewDialogComponent } from '../upload-new-dialog/upload-new-dialog.component';
import { UploadSubmit } from '../image-profile/image-profile.component';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
import { SendQaDialogComponent } from '../send-qa-dialog/send-qa-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {

  @ViewChild('newTag', { static: false }) newTag: ElementRef;

  public toastTrigger$: Subject<ToastMessage> = new Subject<ToastMessage>();
  public mainImageUpload$: Observable<LocalFile>;
  public uploadForm$: Observable<UploadFormCollection>;
  public referenceFiles: any[] = [];
  public uploadFormGroup: FormGroup;
  public addNewTag: Tag;
  public removeSelectedTag: Tag;
  public validateDropdown: boolean = false;
  public enlargeImage: boolean = false;

  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<UploadState>,
    private utilService: UtilityService,
    private uploadService: UploadService,
    private uploadFormBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) {

    this.store.dispatch(new LoadUploadForm());
    
    this.uploadForm$ = this.store.pipe(select(uploadFormCollectionSelector));

    this.uploadFormGroup = this.uploadFormBuilder.group({
      fileName: [null, [Validators.required]],
      description: [null],
      languageId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      tags: [null, [Validators.required]],
      priority: [null, [Validators.required]],
      status: [null],
      mainFileStorageId: [null],
      referenceFiles: [null]
    });
  }

  ngOnInit() {
    this.uploadService.uploadSaveSuccessDialog$
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((uploadSavedData: UploadSaveDialog) => {
      if (uploadSavedData) {
        this.matDialog.open(SaveDialogComponent, {
          width: '480px',
          data: uploadSavedData
        }).afterClosed()
          .pipe(takeUntil(this._unsubscribe$))
          .subscribe((response: boolean) => {
            if (response) {
              this.onCloseUploadForm();
            }
          });
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this.onCloseUploadForm();
  }

  public onFileUpload(file: File): void {
    if (this.isFileTypeImage(file)) {
      this.utilService.convertBlobToBase64(file)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe((b64Result: string) => {
          this.mainImageUpload$ = of({
            name: file.name,
            file: file,
            base64: b64Result
          });

          this.referenceFiles.splice(0, 1, {
            base64: b64Result,
            name: file.name,
            type: this.getFileType(file.name),
            file: file
          });

          this.uploadFormGroup.patchValue({fileName: file.name});
        });
    } else {
      let toast: ToastMessage = {
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid file type (Accepts only image files)'
      };
      this.toastTrigger$.next(toast); 
    }
  }

  public onCloseUploadForm(): void {
    this.referenceFiles = []
    this.mainImageUpload$ = of();
    this.uploadFormGroup.reset();
    this.uploadFormGroup.markAsPristine();
    this.uploadService.isUploadFormSubmitted$.next(false);
  }

  public onSave(): void {
    this.validateDropdown = true;
    if (this.uploadFormGroup.valid) {
      this.uploadService.isUploadFormSubmitted$.next(true);
      let mainFileFormData = new FormData();
      this.mainImageUpload$.pipe(take(1)).subscribe((mainFileData: LocalFile) => {
        mainFileFormData.append('file', mainFileData.file, mainFileData.name);
        this.newUploadForm(mainFileFormData, (payload: UploadInfo) => {
          this.store.dispatch(new UploadSave(payload));
        });
      });
    }
  }

  public openSendQADialog(): void {
    this.validateDropdown = true;
    if (this.uploadFormGroup.valid) {
      this.uploadForm$.pipe(
        map((uploadForm: UploadFormCollection) => uploadForm.qAs),
        take(1))
      .subscribe((qaList: QA[]) => {
        this.matDialog.open(SendQaDialogComponent, {
          width: '450px',
          data: qaList
        }).afterClosed()
          .pipe(take(1))
          .subscribe((qa: QAForm) => {
            if (qa) {
              this.uploadService.isUploadFormSubmitted$.next(true);
              this.onSendToQa(qa);
            }
        });
      });
    }
  }

  public onShowImageModal(): void {
    this.enlargeImage = !this.enlargeImage;
  }

  public addReferenceDialog(): void {
    this.matDialog.open(AddSourceDialogComponent, {
      width: '480px'
    }).afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((reference: FileList) => {
        if (reference) {
          this.getReferenceFileData(reference);
        }
      });
  }

  public updateMainFile(): void {
    this.matDialog.open(UploadNewDialogComponent, {
      width: '480px'
    }).afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((file: File) => {
        if (file) {
          this.onFileUpload(file);
        }
      });
  }

  public removeReferenceDialog(index: number, name: string): void {
    this.matDialog.open(ConfirmDialogComponent, {
      width: '480px',
      data: { fileName: name }
    }).afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.referenceFiles.splice(index, 1);
        }
      });
  }

  public onDropdownItemSelection(event: MatSelectChange, selection: string): void {
    setTimeout(() => { // TODO: Investigate further for ExpressionChangedAfterHasBeenCheckedError
      switch (selection) {
        case 'language':
          this.uploadFormGroup.get('languageId').patchValue(event.value.key);
          break;
        case 'category':
          this.uploadFormGroup.get('categoryId').patchValue(event.value.key);
          break;
        case 'tag':
          this.uploadFormGroup.get('tags').patchValue([...event.value]);
          break;
      }
    });
  }

  public onAddNewTag(): void {
    const newTag: string = this.newTag.nativeElement.value;
    if (newTag) {
      this.uploadService.addNewTag(newTag)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(
        (res: Tag) => {
          this.addNewTag = res;
          this.newTag.nativeElement.value = '';
        }
      );
    }
  }

  public onRemoveTag(tag: Tag): void {
    this.removeSelectedTag = tag;
  }

  private onSendToQa(qaData: QAForm): void {
    if (this.uploadFormGroup.valid) {
      let mainFileFormData = new FormData();
      this.mainImageUpload$.pipe(take(1)).subscribe((mainFileData: LocalFile) => {
        mainFileFormData.append('file', mainFileData.file, mainFileData.name);
        this.newUploadForm(mainFileFormData, (payload: UploadInfo) => {
          this.store.dispatch(new UploadSendToQa({
            remark: qaData.note,
            qAs: [qaData.qAid],
            ...payload
          }));
        });
      })
    }
  }

  private addUpload = (action: UploadSubmit, referenceFilesId?: string[]) => {
    const payload: UploadInfo = {
      ...this.uploadFormGroup.value,
      status: 'InProgress',
      tags: this.uploadFormGroup.get('tags').value.map((tag: Tag) => tag.key),
      referenceFiles: referenceFilesId ? referenceFilesId : []
    };
    action(payload);
  }

  private newUploadForm(formData: any, action: UploadSubmit): void {
    this.uploadService.uploadMainFile(formData).subscribe((response: any) => {
      this.uploadFormGroup.get('mainFileStorageId').patchValue(response);
        if (this.referenceFiles.length > 1) { // Must skip first element
          let referenceDataSource = new FormData();
          for (let i = 1; i < this.referenceFiles.length; i++) {
            referenceDataSource.append('files', this.referenceFiles[i].file, this.referenceFiles[i].name);
          }
          this.uploadSources(referenceDataSource, action, this.addUpload);
        } else {
          this.addUpload(action);
        }
    });
  }

  private uploadSources(formData: any, action: UploadSubmit, callback: any): void {
    this.uploadService.uploadSources(formData).subscribe((response: any) => {
      callback(action, response);
    });
  }

  private isFileTypeImage(file: File): boolean {
    return (this.getFileType(file.name) === 'jpg' 
            || this.getFileType(file.name) === 'jpeg')
            || this.getFileType(file.name) === 'png' ? true : false;
  }

  private getFileType(text: string): string {
    const getFileType: RegExp = /(?:\.([^.]+))?$/;
    return getFileType.exec(text)[1];
  }

  private blobToImage(img: File): Promise<string> {
    return new Promise(function (resolve) {
      let reader = new FileReader();
      reader.onloadend = function (e: any) {
        resolve(e.target.result);
      };
      reader.readAsDataURL(img);
    });
  }

  private async getReferenceFileData(files: FileList) {
    for (let file of Array.from(files)) {
      this.referenceFiles.push({
        base64: await this.blobToImage(file),
        name: file.name,
        type: this.getFileType(file.name),
        file: file
      });
    }
  }
}
