import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})

export class ConfirmDialogComponent {
  
  public fileName: string;
  
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public file: {fileName: string}
  ) {
    this.fileName = file.fileName;
  }
  
  public onClose(): void {
    this.dialogRef.close(false);
  }
  
  public onConfirm(): void {
    this.dialogRef.close(true);
  }
  
}
