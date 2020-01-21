import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-container',
  templateUrl: './upload-container.component.html',
  styleUrls: ['./upload-container.component.scss']
})
export class UploadContainerComponent implements OnInit {
  constructor() { }

  public events: string[] = [];
  public opened: boolean;

  ngOnInit(): void { }
}
