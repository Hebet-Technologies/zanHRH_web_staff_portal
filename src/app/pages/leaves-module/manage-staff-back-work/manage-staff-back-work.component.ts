import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { TableService } from 'src/app/core/services/table.service';
import { RootReducerState } from 'src/app/store';
import { addConfirmLeaveReturnToWork, fetchStaffBackToWork, loadLeaveReturnedToWorkLetter, loadLeaveReturnedToWorkLetterSuccess } from 'src/app/store/Leave_store/leave_action';
import { selectLeaveLoading, selectStaffBackToWork } from 'src/app/store/Leave_store/leave_selector';
import { StaffBackToWorkFormComponent } from './staff-back-to-work-form/staff-back-to-work-form.component';
import { ConfirmLeaveReturnToWorkPayload } from 'src/app/store/Leave_store/leave_model';

@Component({
  selector: 'app-manage-staff-back-work',
  templateUrl: './manage-staff-back-work.component.html',
  styleUrl: './manage-staff-back-work.component.scss',
  providers: [TableService] 
  
})
export class ManageStaffBackWorkComponent implements OnInit,OnDestroy{
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
      public staffBackToWorkTable: TableService<any>,
    ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'View Staff' },
      { label: 'Staff Return To Work Request', active: true }
    ];
    
    this.loadStaffBackToWorkList();
  }

  loadStaffBackToWorkList(): void {
    this.store.select(selectLeaveLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    this.store.dispatch(fetchStaffBackToWork());
    this.store.select(selectStaffBackToWork)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.staffBackToWorkTable.setData(data || []); 
    });

    //file download pdf
    this.actions$.pipe(
      ofType(loadLeaveReturnedToWorkLetterSuccess),
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

  openModalSatffReturnToLeave(rowData: any) {
    const modalRef = this.modalService.open(StaffBackToWorkFormComponent, { size: 'md', centered: true });
    modalRef.componentInstance.rowdataSelected = rowData; // 👈 muhimu
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const payload: ConfirmLeaveReturnToWorkPayload = {
        leave_request_id: rowData.leave_request_id,
        ...data
      };
      this.store.dispatch(addConfirmLeaveReturnToWork({ newData: payload }));
      modalRef.close();
    });
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }

  // currently selected row data
  selectedStaffToWorkRequest: any = null;
  selectedId: number | null = null;
  onClickChatData(rowData: any) {
    this.selectedStaffToWorkRequest = rowData;
    this.selectedId = rowData.leave_request_id;
    (document.getElementById("emailchat-detailElem") as HTMLElement).style.display = "block";
  }
  // Close Chat
  closeChat() {
    (document.getElementById("emailchat-detailElem") as HTMLElement).style.display = "none";
    this.selectedStaffToWorkRequest = null;
    this.selectedId = null;
  }

  //print letter
  generatePDFStaffBackToWork(id: number): void {
    const loader = document.getElementById('elmLoader');
    this.isLoading = true;
    if (loader) {
      loader.classList.remove('d-none'); // 👈 show loader
    }
    this.store.dispatch(loadLeaveReturnedToWorkLetter({ id }));
  }

  // SEARCH start
  performSearch() {
    this.staffBackToWorkTable.search(this.searchTerm, [
      'first_name',
      'middle_name',
      'last_name',
      'sur_name',
      'phone_number',
      'leave_type',
      'working_station_name',
      'post_category_name',
      'start_date',
      'end_date',
      'leave_path_name'
      
    ]);
  }
  onSort(column: string) {
    this.staffBackToWorkTable.sort(column as any);
  }
  //end search
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
