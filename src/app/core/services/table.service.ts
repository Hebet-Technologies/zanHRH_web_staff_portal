import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService <T> {

  private allData: T[] = [];
  private filteredData: T[] = [];

  private _data$ = new BehaviorSubject<T[]>([]);
  data$ = this._data$.asObservable();

  page = 1;
  pageSize = 5;
  searchTerm = '';
  direction: 'asc' | 'desc' = 'asc';

  startIndex = 0;
  endIndex = 0;

  setData(data: T[]) {
    this.allData = [...data];
    this.filteredData = [...data];
    this.page = 1;
    this.refresh();
  }

  search(term: string, keys: (keyof T)[]) {
    this.searchTerm = term.toLowerCase();
    this.page = 1;

    if (!term) {
      this.filteredData = [...this.allData];
    } else {
      this.filteredData = this.allData.filter(item =>
        keys.some(key =>
          String(item[key] ?? '').toLowerCase().includes(this.searchTerm)
        )
      );
    }

    this.refresh();
  }

  sort(column: keyof T) {
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';

    this.filteredData.sort((a: any, b: any) => {
      const res = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
      return this.direction === 'asc' ? res : -res;
    });

    this.refresh();
  }

  changePage(page: number) {
    this.page = page;
    this.refresh();
  }

  changePageSize(size: number | 'All') {
    this.pageSize = size === 'All' ? this.filteredData.length : size;
    this.page = 1;
    this.refresh();
  }

  private refresh() {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.startIndex = start + 1;
    this.endIndex = end > this.filteredData.length ? this.filteredData.length : end;

    this._data$.next(this.filteredData.slice(start, end));
  }

  get total() {
    return this.filteredData.length;
  }
}
