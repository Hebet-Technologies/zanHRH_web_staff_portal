import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { TableService } from 'src/app/core/services/table.service';
import { RootReducerState } from 'src/app/store';
import { fetchLeaveRequestToApprove, setSelectedLeaveRequest } from 'src/app/store/Leave_store/leave_action';
import { selectLeaveLoading, selectLeaveRequestToApprove } from 'src/app/store/Leave_store/leave_selector';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-approve-leave-request',
  templateUrl: './manage-approve-leave-request.component.html',
  styleUrl: './manage-approve-leave-request.component.scss',
  providers: [TableService] 
  
})
export class ManageApproveLeaveRequestComponent implements OnInit,OnDestroy{
  breadCrumbItems!: Array<{}>;
  isLoading = true;

  private destroy$ = new Subject<void>();
  searchTerm = '';
  searchTermPath = '';
  pageSizes = [5, 10, 20, 50, 100, 'All'];
  groupedApprovedRequests: { name: string; count: number }[] = [];
  filteredApprovedRequests: { name: string; count: number }[] = [];

  constructor(
      private modalService: NgbModal, 
      private actions$: Actions,
      private router: Router, 
      public permission: PermissionService,
      private store: Store<{ data: RootReducerState }>, 
      public staffApproveRequestTable: TableService<any>,
    ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'View Staff' },
      { label: 'Staff Approve Leave Request', active: true }
    ];
    
    this.loadStaffApproveRequestList();
  }

  loadStaffApproveRequestList(): void {
    this.store.select(selectLeaveLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    this.store.dispatch(fetchLeaveRequestToApprove());
    this.store.select(selectLeaveRequestToApprove)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.staffApproveRequestTable.setData(data || []); 

      // 👉 group + count
      const list = data || [];
      const grouped = list.reduce((acc: any, curr: any) => {
        const key = curr.working_station_name;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key]++;
        return acc;
      }, {});
      // 👉 convert to array
      this.groupedApprovedRequests = Object.keys(grouped).map(key => ({
        name: key,
        count: grouped[key]
      }));
      // default display
      this.filteredApprovedRequests = [...this.groupedApprovedRequests];

    });
  }

  // currently selected row data
  selectedApproveRequest: any = null;
  openModalApproveRequest(content: any, rowData: any, checkbox: HTMLInputElement) {
    checkbox.checked = true;
    this.selectedApproveRequest = rowData; // save data ya row
    this.modalService.open(content, { size: 'md', centered: true }).result
      .finally(() => {
        checkbox.checked = false;
        this.selectedApproveRequest = null;
      });
  }
  performSearchLeavePath() {
    const term = this.searchTermPath.toLowerCase();
    this.filteredApprovedRequests = this.groupedApprovedRequests.filter(item =>
      item.name.toLowerCase().includes(term)
    );
  }

  openAttachment(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }
  getColorClasses(color: string): string {
    const colorMap: any = {
      red: 'bg-danger-subtle text-danger',
      brown: 'bg-primary-subtle text-primary',
      cyan: 'bg-warning-subtle text-warning',
      yellow: 'bg-info-subtle text-info',
      magenta: 'bg-success-subtle text-success',
      violet: 'bg-secondary-subtle text-secondary'
    };

    return colorMap[color] || '';
  }

  goToDetails(data: any) {
    this.store.dispatch(setSelectedLeaveRequest({ data }));
    this.router.navigate(['/app/leave/approve-leave-request-details']);
  }

  // SEARCH start
  performSearch() {
    this.staffApproveRequestTable.search(this.searchTerm, [
      'first_name',
      'middle_name',
      'last_name',
      'sur_name',
      'phone_number',
      'working_station_name',
      'department_name',
      'leave_type',
      'post_category_name',
      'proposed_start_date',
      'proposed_end_date',
      'requested_date'
      
    ]);
  }
  onSort(column: string) {
    this.staffApproveRequestTable.sort(column as any);
  }
  //end search
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
