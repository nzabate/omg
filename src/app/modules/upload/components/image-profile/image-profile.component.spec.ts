import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageProfileComponent } from './image-profile.component';
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

describe('ImageProfileComponent', () => {
  let component: ImageProfileComponent;
  let fixture: ComponentFixture<ImageProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImageProfileComponent],
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
    fixture = TestBed.createComponent(ImageProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ImageReviewComponent', () => {
    expect(component).toBeTruthy();
  });
});
