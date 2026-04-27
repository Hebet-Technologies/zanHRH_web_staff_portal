import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { TableService } from 'src/app/core/services/table.service';
import { RootReducerState } from 'src/app/store';
import { selectLeaveLoading, selectStaffOnLeave } from 'src/app/store/Leave_store/leave_selector';
import { fetchStaffOnLeave, loadGeneralStaffLeaveLetter, loadGeneralStaffLeaveLetterSuccess } from 'src/app/store/Leave_store/leave_action';

@Component({
  selector: 'app-staff-on-leave',
  templateUrl: './staff-on-leave.component.html',
  styleUrl: './staff-on-leave.component.scss',
  providers: [TableService] 
})
export class StaffOnLeaveComponent implements OnInit,OnDestroy{
  breadCrumbItems!: Array<{}>;
  isLoading = true;

  private destroy$ = new Subject<void>();
  searchTerm = '';
  pageSizes = [5, 10, 20, 50, 100, 'All'];

  constructor(
      private modalService: NgbModal, 
      private actions$: Actions,
      public permission: PermissionService,
      private store: Store<{ data: RootReducerState }>, 
      public staffOnLeaveTable: TableService<any>,
    ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'View Staff' },
      { label: 'Staff On Leave', active: true }
    ];
    
    this.loadStaffOnLeaveList();
  }

  loadStaffOnLeaveList(): void {
    this.store.select(selectLeaveLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    this.store.dispatch(fetchStaffOnLeave());
    this.store.select(selectStaffOnLeave)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.staffOnLeaveTable.setData(data || []); 
    });

    //file download pdf
    this.actions$.pipe(
      ofType(loadGeneralStaffLeaveLetterSuccess),
      takeUntil(this.destroy$)
    ).subscribe(({ file }) => {
      const blob = new Blob([file], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
      // 👇 hide loader hapa
      const loader = document.getElementById('elmLoader');
      if (loader) {
        loader.classList.add('d-none');
      }
    });
  }

    //print letter
  generatePDFStaffOnLeave(id: number): void {
    const loader = document.getElementById('elmLoader');
    this.isLoading = true;
    if (loader) {
      loader.classList.remove('d-none'); // 👈 show loader
    }
    this.store.dispatch(loadGeneralStaffLeaveLetter({ id }));
  }

  // SEARCH start
  performSearch() {
    this.staffOnLeaveTable.search(this.searchTerm, [
      'first_name',
      'middle_name',
      'last_name',
      'sur_name',
      'phone_number',
      'working_station_name',
      'department_name',
      'post_category_name',
      'start_date',
      'end_date'
    ]);
  }
  onSort(column: string) {
    this.staffOnLeaveTable.sort(column as any);
  }
  //end search
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
