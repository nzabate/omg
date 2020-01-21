import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadContainerComponent } from './containers/upload-container.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadComponent } from './components/upload/upload.component';
import { ImageProfileComponent } from './components/image-profile/image-profile.component';
import { SharedModule } from 'src/app/shared/share.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendQaDialogComponent } from './components/send-qa-dialog/send-qa-dialog.component';
import { SaveDialogComponent } from './components/save-dialog/save-dialog.component';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule,
  MatExpansionModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { FullLayoutComponent } from '../../layouts/full/full-layout.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AddSourceDialogComponent } from './components/add-source-dialog/add-source-dialog.component';
import { UploadNewDialogComponent } from './components/upload-new-dialog/upload-new-dialog.component';
import { UploadDetailCardComponent } from './components/upload-detail-card/upload-detail-card.component';
import { ImageReviewComponent } from './components/image-review/image-review.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule,
  MatExpansionModule,
  MatProgressSpinnerModule
];

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: UploadComponent },
      { path: 'image-review', component: ImageReviewComponent },
      { path: 'image-profile', component: ImageProfileComponent }
    ],
  },
];

@NgModule({
  declarations: [
    UploadContainerComponent,
    UploadComponent,
    ImageProfileComponent,
    SendQaDialogComponent,
    ConfirmDialogComponent,
    SaveDialogComponent,
    AddSourceDialogComponent,
    FullLayoutComponent,
    UploadNewDialogComponent,
    UploadDetailCardComponent,
    ImageReviewComponent
  ],
  imports: [
    ...materialModules,
    FlexLayoutModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    SendQaDialogComponent,
    ConfirmDialogComponent,
    SaveDialogComponent,
    AddSourceDialogComponent,
    UploadNewDialogComponent
  ],
  exports: [
    RouterModule
  ]
})

export class UploadRoutingModule { }
