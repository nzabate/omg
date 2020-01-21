import { Component, OnInit } from '@angular/core';
import { History } from '../models/history.model';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { HistoryState } from '../store/reducers/history.reducer';
import * as fromHistory from '../store/reducers/history.reducer';
import { LoadHistory, DeleteHistory } from '../store/actions/history.action';
import { ActivatedRoute } from '@angular/router';
import { searchSelector } from '../../search/store/selectors/search.selector';

@Component({
  selector: 'app-history-containers',
  templateUrl: './history-containers.component.html',
  styleUrls: ['./history-containers.component.scss']
})
export class HistoryContainersComponent implements OnInit {

  public history$: Observable<History>;
  public loadHistoryData$ = new Subject<any>();

  private isSearch: boolean;

  constructor(
    private store: Store<HistoryState>,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.isSearch = params.is_search;
    });
   }

  ngOnInit() {
    if (this.isSearch) {

      this.store.pipe(select(searchSelector)).subscribe((res) => {
        setTimeout(() => { // TODO: Create different implementation
          this.loadHistoryData$.next(res);
        }, 1000);
      });

    } else {
      const payload: any = {page: {min: 0, max: 100000}}; // TODO: make dynamic or lazyload
      this.store.dispatch(new LoadHistory(payload));
      this.history$ = this.store.pipe(select(fromHistory.getHistoryList));
      this.history$.subscribe((history: any) => {
        if (history.history) {
          this.loadHistoryData$.next(history.history);
        }
      });
    }
  }

  public handleLoadHistoryEvent(payload: any) {
    this.store.dispatch(new LoadHistory(payload));
  }

  public handleDeleteHistoryEvent(payload: any) {
    this.store.dispatch(new DeleteHistory(payload));
  }
}
