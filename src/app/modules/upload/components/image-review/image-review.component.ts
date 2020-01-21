import { Component, NgZone, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { UploadState } from '../../store/reducers/upload.reducer';
import { UtilityService } from 'src/app/services/utility.service';
import { UploadService } from '../../services/upload.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ChatService } from 'src/app/services/chat-service';
import { take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageReviewResource, ImageReviewMessage, FileDetail, UpdateMainFile, Files, DeleteReference } from '../../models/upload.model';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { ToastMessage } from 'src/app/models/toast.model';
import { UploadNewDialogComponent } from '../upload-new-dialog/upload-new-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AddSourceDialogComponent } from '../add-source-dialog/add-source-dialog.component';

@Component({
  selector: 'app-image-review',
  templateUrl: './image-review.component.html',
  styleUrls: ['./image-review.component.scss']
})
export class ImageReviewComponent implements OnInit, OnDestroy {

  @ViewChild(PerfectScrollbarComponent, {static: false})
  public directiveScroll: PerfectScrollbarComponent;

  sender: string;
  group: number;

  public toastTrigger$ = new Subject<ToastMessage>();
  public imageReviewResource: ImageReviewResource;
  public enlargeImage: boolean = false;
  public isTakingAction: boolean = false;

  public chatFormGroup = new FormGroup({
    chatMessage: new FormControl('')
  });

  /**
   * TODO: Find another way
   * Used only for message container to scroll down if new messages are emitted
   */
  private messageChecker$ = new Subject<ImageReviewMessage[]>(); // TODO: Find another way

  private resourceId: number;
  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(
    private store: Store<UploadState>,
    private utilService: UtilityService,
    private uploadService: UploadService,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog,
    private chatService: ChatService,
    private ngZone: NgZone,
    private router: Router
  ) {

    this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
      this.resourceId = params['resourceId'];
    });

    this.uploadService.getImageReviewResource(this.resourceId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((imageReviewRes: ImageReviewResource) => {
        this.imageReviewResource = {
          ...imageReviewRes,
          ...this.modifyFiles({
            main: imageReviewRes.main,
            references: imageReviewRes.references
          })
        };
        this.messageChecker$.next(imageReviewRes.messages);
      });

    this.subscribeToMessages();

  }

  ngOnInit() {
    this.onGroupSelected(this.resourceId);
    this.messageChecker$.pipe(takeUntil(this._unsubscribe$)).subscribe((messages: ImageReviewMessage[]) => {
      if (messages) {
        setTimeout(() => { // Needed delay to scroll down
          this.directiveScroll.directiveRef.scrollToBottom();
        }, 500);
      }
    })
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  public onGroupSelected(currentValue): void {
    if (!!this.group) {
      this.chatService.leaveResourceGroup(this.group);
    }
    this.group = currentValue;
    this.chatService.joinResourceGroup(this.group);
  }

  /**
   * TODO: Refactor; Use NgRx
   */
  public sendMessage(): void {
    const message: ImageReviewMessage = {
        content: this.chatFormGroup.get('chatMessage').value,
        date: new Date().toDateString(),
        senderName: this.imageReviewResource.name,
        senderId: this.imageReviewResource.userId,
        avatar: this.imageReviewResource.avatar || `https://api.adorable.io/avatars/40/${this.imageReviewResource.userId}`
    };

    this.messageChecker$.next([message]);
    this.chatService.sendMessageToResourceGroup(this.group, message);
    this.uploadService.sendMessage({
      resourceId: this.resourceId,
      message: this.chatFormGroup.get('chatMessage').value
    }).subscribe();

    this.chatFormGroup.get('chatMessage').reset();
  }

  public subscribeToMessages(): void {
    this.chatService.messageReceived.subscribe((msg: ImageReviewMessage) => {
        this.ngZone.run(() => {
        this.imageReviewResource.messages.push(msg);
        this.messageChecker$.next([msg]);
      });
    });
  }

  public updateMainFile(): void {
    this.matDialog.open(UploadNewDialogComponent, {
      width: '480px'
    }).afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((file: File) => {
        if (file) {
          this.onUpdateMainFile(file);
        }
      });
  }

  public onUpdateMainFile(file: File): void {
    if (this.isFileTypeImage(file)) {

      this.updateFileController(file);
      this.updateFileDisplayController(file);

    } else {
      let toast: ToastMessage = {
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid file type (Accepts only image files)'
      };
      this.toastTrigger$.next(toast);
    }
  }

  public getFileType(text: string): string {
    const getFileType: RegExp = /(?:\.([^.]+))?$/;
    return getFileType.exec(text)[1];
  }

  public onShowImageModal(): void {
    this.enlargeImage = !this.enlargeImage;
  }

  public removeReferenceDialog(index: number, name: string, storageId: string): void {
    this.matDialog.open(ConfirmDialogComponent, {
      width: '480px',
      data: { fileName: name }
    }).afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((isConfirm: boolean) => {
        if (isConfirm) {
          this.imageReviewResource.references.splice(index, 1);
          this.deleteReferenceFile({
            resourceId: this.resourceId,
            fileStorageId: storageId
          });
        }
      });
  }

  public onApproveImageReview(): void {
    this.isTakingAction = true;
    this.uploadService.approveImageReview(this.resourceId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {
        let toast: ToastMessage = {
          severity: 'success',
          summary: 'Success',
          detail: 'Approved!'
        };
        this.toastTrigger$.next(toast);
        setTimeout(() => { // Wait for toast message; No design provided
          this.router.navigateByUrl('inbox');
        }, 2000);
      });
  }

  public onDeclineImageReview(): void {
    this.isTakingAction = true;
    this.uploadService.declineImageReview(this.resourceId)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(() => {
        let toast: ToastMessage = {
          severity: 'error',
          summary: 'Declined',
          detail: 'Declined!'
        };
        this.toastTrigger$.next(toast);
        setTimeout(() => { // Wait for toast message; No design provided
          this.router.navigateByUrl('inbox');
        }, 2000);
      });
  }

  public addReferenceDialog(): void {
    this.matDialog.open(AddSourceDialogComponent, {
      width: '480px'
    }).afterClosed()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((references: FileList) => {
        if (references) {

          this.getReferenceFileData(references);

          let referenceFormData = new FormData();

          for (let reference of Array.from(references)) {
            referenceFormData.append('files', reference, reference.name)
          }

          this.uploadService.uploadSources(referenceFormData).subscribe((referenceIds: string[]) => {

            for (let referenceId of referenceIds) {

              this.uploadService.addNewReference({
                resourceId: this.resourceId,
                fileStorageId: referenceId
              }).pipe(takeUntil(this._unsubscribe$)).subscribe();

            }

          });
        }
      });
  }

  private deleteReferenceFile(deleteReference: DeleteReference) {
    this.uploadService.deleteReference(deleteReference).subscribe();
  }

  private modifyFiles(files: Files): Files {
    files.references.unshift(files.main); // Insert main file to reference

    return {
      main: {
        ...files.main,
        absoluteUri: files.main.absoluteUri.toLowerCase()
      },
      references: files.references.map((reference: FileDetail) => {
        return {
          ...reference,
          absoluteUri: reference.absoluteUri.toLowerCase(),
          fileType: this.getFileType(reference.absoluteUri.toLowerCase())
        }
      })
    }
  }

  private isFileTypeImage(file: File): boolean {
    return (this.getFileType(file.name) === 'jpg' 
            || this.getFileType(file.name) === 'jpeg')
            || this.getFileType(file.name) === 'png' ? true : false;
  }

  private updateFileDisplayController(file: File): void {
    this.utilService.convertBlobToBase64(file)
    .pipe(takeUntil(this._unsubscribe$))
    .subscribe((b64Result: string) => {
      this.imageReviewResource.main.absoluteUri = b64Result;
      this.imageReviewResource.references.splice(0, 1, {
        absoluteUri: b64Result,
        fileType: this.getFileType(file.name)
      });
    });
  }

  private updateFileController(file: File): void {
    let mainFileFormData = new FormData();
    mainFileFormData.append('file', file, file.name);

    this.uploadService.uploadMainFile(mainFileFormData)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((response: string) => {
        const updateMainFile: UpdateMainFile = {
          resourceId: this.resourceId,
          fileStorageId: response,
          fileName: file.name
        };
        this.uploadService.updateMainFile(updateMainFile).subscribe();
      });
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
      this.imageReviewResource.references.push({
        absoluteUri: await this.blobToImage(file),
        fileType: this.getFileType(file.name)
      });
    }
  }
}
