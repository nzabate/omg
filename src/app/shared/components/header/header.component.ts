import { Component, OnInit, Input } from '@angular/core';
import { UserProfile } from 'src/app/modules/auth/models/auth.model';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers/app.reducer';
import { getUserProfileSelector } from 'src/app/modules/auth/store/selectors/auth.selector';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()
  public sidenav: any;

  public profileInfo: string;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.pipe(
      select(getUserProfileSelector),
      take(1)
    ).subscribe(
      (userInfo: UserProfile) => {
        if (userInfo) {
          this.profileInfo = userInfo.fullName + ', ' + userInfo.position;
        }
      }
    );
  }
}
