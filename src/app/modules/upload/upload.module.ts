import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from './services/upload.service';
import { UploadRoutingModule } from './upload-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { UploadReducer } from './store/reducers/upload.reducer';
import { UploadEffects } from './store/effects/upload.effect';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../shared/share.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { 
  PERFECT_SCROLLBAR_CONFIG, 
  PerfectScrollbarConfigInterface 
} from 'ngx-perfect-scrollbar';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const materialModules = [
  MatButtonModule,
  NgxMatSelectSearchModule
];

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FlexLayoutModule,
    UploadRoutingModule,
    ...materialModules,
    StoreModule.forFeature('upload', UploadReducer),
    EffectsModule.forFeature([UploadEffects]),
  ],
  exports: [],
  providers: [
    UploadService,
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG }
  ],
})
export class UploadModule { }
