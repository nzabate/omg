import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageReviewComponent } from './image-review.component';
import { SharedModule } from 'src/app/shared/share.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatExpansionModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule, MatDialogModule } from '@angular/material';
import { UploadService } from '../../services/upload.service';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FlexLayoutModule } from '@angular/flex-layout';

describe('ImageReviewComponent', () => {
  let component: ImageReviewComponent;
  let fixture: ComponentFixture<ImageReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageReviewComponent],
      imports: [
        HttpClientModule,
        SharedModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatExpansionModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatCardModule,
        MatDialogModule,
        FlexLayoutModule,
        RouterModule.forRoot([]),
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
      ],
      providers: [UploadService, MessageService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ImageReviewComponent', () => {
    expect(component).toBeTruthy();
  });
});
