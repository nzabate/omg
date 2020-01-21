import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private profileService: ProfileService
  ) { }

  public onClose(): void {
    this.dialogRef.close();
    this.profileService.isUpdateProfileSuccess$.next(false);
  }

}
