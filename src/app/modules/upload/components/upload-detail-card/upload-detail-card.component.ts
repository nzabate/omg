import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-upload-detail-card',
  templateUrl: './upload-detail-card.component.html',
  styleUrls: ['./upload-detail-card.component.scss']
})
export class UploadDetailCardComponent {

  @Input()
  public sidebarTitle: string;

  @Input()
  public addEditOption: boolean;

  @Output()
  public editClick = new EventEmitter();

  public onEdit(): void {
    this.editClick.emit();
  }
}
