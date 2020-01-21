import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-upload-new-dialog',
  templateUrl: './upload-new-dialog.component.html',
  styleUrls: ['./upload-new-dialog.component.scss']
})
export class UploadNewDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UploadNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public onFileUpload(file: File): void {
    this.onClose(file);
  }

  public onClose(file: File): void {
    this.dialogRef.close(file);
  }
}
