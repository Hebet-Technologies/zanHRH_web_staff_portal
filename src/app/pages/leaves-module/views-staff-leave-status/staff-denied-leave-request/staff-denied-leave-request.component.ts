import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { TableService } from 'src/app/core/services/table.service';
import { RootReducerState } from 'src/app/store';
import { fetchStaffDeniedLeaveRequest, loadGeneralStaffLeaveLetter, loadGeneralStaffLeaveLetterSuccess } from 'src/app/store/Leave_store/leave_action';
import { selectLeaveLoading, selectStaffDeniedLeaveRequest } from 'src/app/store/Leave_store/leave_selector';

@Component({
  selector: 'app-staff-denied-leave-request',
  templateUrl: './staff-denied-leave-request.component.html',
  styleUrl: './staff-denied-leave-request.component.scss',
  providers: [TableService] 
  
})
export class StaffDeniedLeaveRequestComponent implements OnInit,OnDestroy{
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
      public staffDeniedRequestTable: TableService<any>,
    ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'View Staff' },
      { label: 'Staff Denied Leave Request', active: true }
    ];
    
    this.loadStaffRequestStageList();
  }

  loadStaffRequestStageList(): void {
    this.store.select(selectLeaveLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    this.store.dispatch(fetchStaffDeniedLeaveRequest());
    this.store.select(selectStaffDeniedLeaveRequest)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.staffDeniedRequestTable.setData(data || []); 
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

  // currently selected row data
  selectedDeniedLeaveRequest: any = null;
  selectedId: number | null = null;
  onClickChatData(rowData: any) {
    this.selectedDeniedLeaveRequest = rowData;
    this.selectedId = rowData.leave_request_id;
    (document.getElementById("emailchat-detailElem") as HTMLElement).style.display = "block";
  }
  // Close Chat
  closeChat() {
    (document.getElementById("emailchat-detailElem") as HTMLElement).style.display = "none";
    this.selectedDeniedLeaveRequest = null;
    this.selectedId = null;
  }

  //print letter
  generatePDFStaffDeniedLeave(id: number): void {
    const loader = document.getElementById('elmLoader');
    this.isLoading = true;
    if (loader) {
      loader.classList.remove('d-none'); // 👈 show loader
    }
    this.store.dispatch(loadGeneralStaffLeaveLetter({ id }));
  }

  // SEARCH start
  performSearch() {
    this.staffDeniedRequestTable.search(this.searchTerm, [
      'first_name',
      'middle_name',
      'last_name',
      'sur_name',
      'phone_number',
      'leave_type',
      'working_station_name',
      'department_name',
      'post_category_name',
      'proposed_start_date',
      'proposed_end_date',
      'leave_path_name'
      
    ]);
  }
  onSort(column: string) {
    this.staffDeniedRequestTable.sort(column as any);
  }
  //end search
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
