import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { TableService } from 'src/app/core/services/table.service';
import { RootReducerState } from 'src/app/store';
import { fetchStaffLeaveRequestStage } from 'src/app/store/Leave_store/leave_action';
import { selectLeaveLoading, selectStaffLeaveRequestStage } from 'src/app/store/Leave_store/leave_selector';

@Component({
  selector: 'app-staff-leave-request-stage',
  templateUrl: './staff-leave-request-stage.component.html',
  styleUrl: './staff-leave-request-stage.component.scss',
  providers: [TableService] 
  
})
export class StaffLeaveRequestStageComponent implements OnInit,OnDestroy{
  breadCrumbItems!: Array<{}>;
  isLoading = true;

  private destroy$ = new Subject<void>();
  searchTerm = '';
  searchTermPath = '';
  pageSizes = [5, 10, 20, 50, 100, 'All'];
  groupedLeavePath: { name: string; count: number }[] = [];
  filteredLeavePath: { name: string; count: number }[] = [];

  constructor(
      private modalService: NgbModal, 
      private actions$: Actions,
      public permission: PermissionService,
      private store: Store<{ data: RootReducerState }>, 
      public staffRequestStageTable: TableService<any>,
    ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'View Staff' },
      { label: 'Staff Request Leave Stage', active: true }
    ];
    
    this.loadStaffRequestStageList();
  }

  loadStaffRequestStageList(): void {
    this.store.select(selectLeaveLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    this.store.dispatch(fetchStaffLeaveRequestStage());
    this.store.select(selectStaffLeaveRequestStage)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.staffRequestStageTable.setData(data || []); 

      // 👉 group + count
      const list = data || [];
      const grouped = list.reduce((acc: any, curr: any) => {
        const key = curr.leave_path_name;
        if (!acc[key]) {
          acc[key] = 0;
        }
        acc[key]++;
        return acc;
      }, {});
      // 👉 convert to array
      this.groupedLeavePath = Object.keys(grouped).map(key => ({
        name: key,
        count: grouped[key]
      }));
      // default display
      this.filteredLeavePath = [...this.groupedLeavePath];

    });
  }

  // currently selected row data
  selectedLeaveStage: any = null;
  // open modal with row data
  openModalLeaveStage(content: any, rowData: any, checkbox: HTMLInputElement) {
    checkbox.checked = true;
    this.selectedLeaveStage = rowData; // save data ya row
    this.modalService.open(content, { size: 'md', centered: true }).result
      .finally(() => {
        checkbox.checked = false;
        this.selectedLeaveStage = null;
      });
  }
  performSearchLeavePath() {
    const term = this.searchTermPath.toLowerCase();
    this.filteredLeavePath = this.groupedLeavePath.filter(item =>
      item.name.toLowerCase().includes(term)
    );
  }






    //print letter
  generatePDFStaffRequestStage(id: number): void {
    const loader = document.getElementById('elmLoader');
    this.isLoading = true;
    if (loader) {
      loader.classList.remove('d-none'); // 👈 show loader
    }
    // this.store.dispatch(loadTrainingApprovedLetter({ id }));
  }

  // SEARCH start
  performSearch() {
    this.staffRequestStageTable.search(this.searchTerm, [
      'first_name',
      'middle_name',
      'last_name',
      'sur_name',
      'phone_no',
      'working_station_name',
      'department_name',
      'post_category_name',
      'proposed_start_date',
      'proposed_end_date',
      'leave_path_name'
      
    ]);
  }
  onSort(column: string) {
    this.staffRequestStageTable.sort(column as any);
  }
  //end search
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
