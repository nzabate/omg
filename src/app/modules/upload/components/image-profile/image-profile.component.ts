import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UploadService } from '../../services/upload.service';
import { uploadFormCollectionSelector } from '../../store/selectors/upload.selector';
import { Observable, Subject } from 'rxjs';
import { UploadInfo, UploadFormCollection, Category, Tag, Language, UploadForm, FileDetail, ResourceTag, ImageDetail } from '../../models/upload.model';
import { Store, select } from '@ngrx/store';
import { UploadState } from '../../store/reducers/upload.reducer';
import { LoadUploadForm } from '../../store/actions/upload.action';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastMessage } from 'src/app/models/toast.model';
import { MatDialog } from '@angular/material/dialog';
import { SaveDialogComponent } from '../save-dialog/save-dialog.component';
import { takeUntil, take } from 'rxjs/operators';
import { MatSelectChange } from '@angular/material';
import * as _ from 'lodash';

export type UploadSubmit = (payload: UploadInfo) => void;

@Component({
  selector: 'app-image-profile',
  templateUrl: './image-profile.component.html',
  styleUrls: ['./image-profile.component.scss']
})

export class ImageProfileComponent implements OnInit, OnDestroy {

  @ViewChild('newTag', { static: false }) newTag: ElementRef;

  public toastTrigger$: Subject<ToastMessage> = new Subject<ToastMessage>();
  public uploadFormGroup: FormGroup;
  public uploadFormData$: Observable<UploadFormCollection>;
  public imageDetails: ImageDetail;
  public addNewTag: Tag;
  public removeSelectedTag: Tag;
  public enlargeImage: boolean = false;
  public isFormEditable: boolean = false;
  public validateDropdown: boolean = false;
  public isShowShareDialog: boolean = false;

  private resourceId: number;
  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<UploadState>,
    private uploadService: UploadService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) {
    this.store.dispatch(new LoadUploadForm());
    this.uploadFormData$ = this.store.pipe(select(uploadFormCollectionSelector));

    this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
      this.resourceId = params['resourceId'];
    });

    this.uploadFormGroup = this.formBuilder.group({
      resourceId: [null],
      fileName: [null, [Validators.required]],
      description: [null],
      designer: [null],
      dateUploaded: [null],
      languageId: [null, [Validators.required]],
      categoryId: [null, [Validators.required]],
      tags: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchUploadFormDetails(this.resourceId);
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  public updateSuccess(): void { // TODO: Refactor
    this.uploadService.isUploadFormSubmitted$.next(false);
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('upload/image-profile?resourceId=' + this.resourceId);
    });
  }

  public onShowImageModal(): void {
    this.enlargeImage = !this.enlargeImage;
  }

  public toggleEdit(): void {
    this.isFormEditable = !this.isFormEditable;

    this.uploadFormGroup.patchValue({
      ...this.imageDetails
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
        default:
          throw new Error('Unknown selection type')
      }
    });
  }

  public onDownloadAllFiles(): void { // TODO: BE should accept big files

    if (this.imageDetails.references) {
      let files: string[] = this.imageDetails.references
        .map(file => file.fileStorageId)

      files.push(this.imageDetails.main.fileStorageId);

      this.uploadService.downloadAllFiles(files).subscribe(response => {
        const blob = new Blob([response], {
          type: 'application/zip'
        });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      });
    }
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

  public onUpdate(): void {
    this.validateDropdown = true;
    if (this.uploadFormGroup.valid) {
      this.uploadService.isUploadFormSubmitted$.next(true);
      const modifiedUploadForm = {
        ...this.uploadFormGroup.value,
        tags: this.uploadFormGroup.get('tags').value.map((tag: Tag) => tag.key)
      }

      this.uploadService.updateUploadForm(modifiedUploadForm)
        .pipe(takeUntil(this._unsubscribe$))
        .subscribe(() => {
          this.matDialog.open(SaveDialogComponent, {
            width: '480px',
            data: {
              fileName: this.uploadFormGroup.get('fileName').value,
              sendType: 'update'
            }
          }).afterClosed()
            .pipe(takeUntil(this._unsubscribe$))
            .subscribe((response: boolean) => {
              if (response) {
                this.updateSuccess();
              }
            });
        });
    }
  }

  public onShowShareDialog(): void {
    this.isShowShareDialog = !this.isShowShareDialog;
  }

  private fetchUploadFormDetails(resourceId: number): void {
    this.uploadService.fetchUploadInfo(resourceId)
      .pipe(take(1))
      .subscribe((uploadFormRes: UploadForm) => {

        const modifiedTags: Tag[] = uploadFormRes.tag.resourceTags.map((resourceTag: ResourceTag) => {
          return {
            key: resourceTag.tag.id,
            value: resourceTag.tag.label
          }
        });

        const modifiedReferences: FileDetail[] = uploadFormRes.file.references.map((reference: FileDetail) => {
          return {
            absoluteUri: reference.absoluteUri.toLowerCase(),
            fileStorageId: reference.fileStorageId.toLowerCase(),
            fileType: this.getFileType(reference.absoluteUri),
          }
        });

        // Include main file as reference
        modifiedReferences.unshift({
          absoluteUri: uploadFormRes.file.main.absoluteUri.toLowerCase(),
          fileStorageId: uploadFormRes.file.main.fileStorageId.toLowerCase(),
          fileType: this.getFileType(uploadFormRes.file.main.absoluteUri),
        })

        this.imageDetails = {
          ...uploadFormRes.generalInfo.model,
          ...uploadFormRes.file,
          references: modifiedReferences,
          tags: modifiedTags,
          histories: uploadFormRes.histories,
          language: uploadFormRes.generalInfo.languages
            .filter((language: Language) => language.key === uploadFormRes.generalInfo.model.languageId)[0],
          category: uploadFormRes.generalInfo.categories
            .filter((category: Category) => category.key === uploadFormRes.generalInfo.model.categoryId)[0]
        }
      });
  }

  private getFileType(text: string): string {
    const getFileType: RegExp = /(?:\.([^.]+))?$/;
    return getFileType.exec(text)[1];
  }
}
