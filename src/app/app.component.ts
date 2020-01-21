import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, RouterEvent, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { HttpLoaderService } from './services/http-loader.service';
import { Observable } from 'rxjs';
import { Logout } from './modules/auth/store/actions/auth.action';
import { AuthState } from './modules/auth/store/reducers/auth.reducer';
import { isUserCanQaSelector, isLoggedInSelector } from './modules/auth/store/selectors/auth.selector';
import { ChatService } from './services/chat-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public showRouteTransitionLoader = false;
  public title = 'OMG';
  public loader$: Observable<boolean>;

  public events: string[] = [];
  public opened: boolean;
  public nbg: boolean;
  public isLoggedIn$: Observable<boolean>;

  public canQa$: Observable<boolean>;

  constructor(
    private httpLoaderService: HttpLoaderService,
    private authStore: Store<AuthState>,
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService
  ) {

    this.loader$ = this.httpLoaderService.loader$;

    this.activatedRoute.queryParams.subscribe(params => {
      this.nbg = params['nbg'];
    });

  }

  ngOnInit() {

    this.isLoggedIn$ = this.authStore.pipe(select(isLoggedInSelector));

    this.canQa$ = this.authStore.pipe(select(isUserCanQaSelector));

  }

  public interceptRouteChangeEvent(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.showRouteTransitionLoader = true;
    }
    if (event instanceof NavigationEnd) {
      this.showRouteTransitionLoader = false;
    }
    if (event instanceof NavigationCancel) {
      this.showRouteTransitionLoader = false;
    }
    if (event instanceof NavigationError) {
      this.showRouteTransitionLoader = false;
    }
  }

  public onLogout(sidenav: any) {
    sidenav.toggle();
    this.authStore.dispatch(new Logout());
  }
}
