import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { SearchState } from '../../store/reducers/search.reducer';
import { searchFormCollectionSelector } from '../../store/selectors/search.selector';
import { LoadSearchForm, LoadSearch } from '../../store/actions/search.action';
import { SearchFormCollection } from '../../models/search.model';
import { Router } from '@angular/router';
import { UploadFormCollection, Tag } from 'src/app/modules/upload/models/upload.model';
import { uploadFormCollectionSelector } from 'src/app/modules/upload/store/selectors/upload.selector';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  public defaultDate = new Date();
  public searchType: 'OwnPortfolio' | 'EntireDatabase' = 'OwnPortfolio';
  public name = null;
  public languages = [];
  public tags = [];
  public statuses = [];
  public assignedTo = [];
  public category = [];
  public selectedTagItems: Tag[] = [];

  public searchForm$: Observable<SearchFormCollection>;
  public uploadForm$: Observable<UploadFormCollection>;
  public isSearching: boolean = false;

  private dateFrom = null;
  private dateTo = null;
  private selectedTagIds: number[] = [];

  constructor(
    private store: Store<SearchState>,
    private router: Router
  ) {
    this.searchForm$ = this.store.pipe(select(searchFormCollectionSelector));
    this.store.dispatch(new LoadSearchForm());
  }

  @ViewChild('inputDateRange', { static: false }) inputDateRange: ElementRef;

  ngOnInit() {
  }

  public onSearch(): void {
    this.isSearching = true;

    const payload = {
      'filter': {
        'searchType': this.searchType,
        'dateFrom': this.dateFrom,
        'dateTo': this.dateTo,
        'name': this.name,
        'languages': this.languages,
        'tags': this.selectedTagIds,
        'statuses': this.statuses,
        'assignedTo': this.assignedTo,
        'categories': this.category
      },
      'page': {
        'min': 0,
        'max': 1000000 // TODO: Make dynamic; Lazy Load
      }
    };

    this.store.dispatch(new LoadSearch(payload));

  }


  public onSelectTagChange(event: any): void {
    this.selectedTagItems = event.value;
    this.selectedTagIds = [];

    this.selectedTagItems.forEach(tag => {
      this.selectedTagIds.push(tag.key);
    });
  }

  public handleSelectChange(ev: any, prop) {
    this[prop] = [ev.value.key];
  }

  public onDateChange(event: any): void {
    if (event.startDate) {
      this.dateFrom = event.startDate._d;
      this.dateTo = event.endDate._d;
    }
  }
}
