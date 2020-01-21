import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadSaveDialog } from '../../models/upload.model';

@Component({
  selector: 'app-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SaveDialogComponent {

  constructor(private dialogRef: MatDialogRef<SaveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public uploadSavedData: UploadSaveDialog) {
  }

  public onClose(): void {
    this.dialogRef.close(true);
  }

  public onConfirm(): void {
    this.dialogRef.close(true);
  }
}
