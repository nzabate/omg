import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {UserInfo} from '../../../auth/models/auth.model';
import {select, Store} from '@ngrx/store';
import {profileSelector} from '../../store/selectors/profile.selector';
import {ProfileState} from '../../store/reducers/profile.reducer';
import { ProfileService } from '../../services/profile.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public profile$: Observable<UserInfo>;
  public me: null;
  public styles = {
    'padding': '84px 20px 24px 20px',
    'width': '100%',
    'max-width.px': '750',
  };

  constructor(private profileService: ProfileService) {
    this.profileService.getUpdateProfile()
    .pipe(take(1))
    .subscribe((res: any) => {
      if (res) {
        this.me = res['model'];
      }
    });
  }

  ngOnInit() {
  }

}
