import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { addLeave, addLeaveFailure, addLeaveReturnToWork, addLeaveReturnToWorkFailure, addLeaveReturnToWorkSuccess, addLeaveSuccess, deleteLeave, deleteLeaveFailure, deleteLeaveSuccess, fetchLeaveData, loadCountry, loadLeaveHistoryData, loadLeaveLetter, loadLeaveLetterSuccess, loadLeaveReturnedToWorkLetter, loadLeaveReturnedToWorkLetterSuccess, loadLeaveStatusRequestForm, loadPersonalDetail, loadRepresentatives } from 'src/app/store/Leave_store/leave_action';
import { selectLeaveLoading, selectLeaveData, selectLeaveStatusRequestForm, selectPersonalDetail, selectRepresentatives, selectCountry, selectLeaveHistory } from 'src/app/store/Leave_store/leave_selector';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { LeaveRequestPayload, LeaveReturnToWorkPayload } from 'src/app/store/Leave_store/leave_model';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { LeaveRequestEmployeeFormComponent } from './leave-request-employee-form/leave-request-employee-form.component';
import { ReturnToLeaveRequestEmployeeFormComponent } from './return-to-leave-request-employee-form/return-to-leave-request-employee-form.component';


@Component({
  selector: 'app-leave-request-employee',
  templateUrl: './leave-request-employee.component.html',
  styleUrl: './leave-request-employee.component.scss',
})
export class LeaveRequestEmployeeComponent implements OnInit,OnDestroy{
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  // Api Data
  leaveRequest: any[] = [];
  allLeaveRequest: any[] = [];
  leaveHistory: any[] = [];
  allLeaveHistory: any[] = [];
  searchTerm = '';

  leaveStatusRequestOptions: any[] = [];
  employeePhoneNo!: string;
  representOptions: any[] = [];
  coutryOptions: any[] = [];

  deleteId!: number;
  employeeID: any;
  roleID: any;

  // For unsubscribing
  private destroy$ = new Subject<void>();

  constructor(
    private modalService: NgbModal, 
    private actions$: Actions,
    public permission: PermissionService,
    public service: PaginationService,  
    private store: Store<{ data: RootReducerState }>, 
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Leave' },
      { label: 'Leave Request', active: true }
    ];
    const user = JSON.parse(localStorage.getItem('user')!);
    this.employeeID = user.personalInformationID;
    this.roleID = user.roleId;
    this.loadLeaveRequest();
    this.loadData();
    this.listenAllLeaveActions();
  }

  private loadData(): void {
    this.store.select(selectLeaveLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
      if (!loading) {
        const loader = document.getElementById('elmLoader');
        if (loader) {
          loader.classList.add('d-none');
        }
      }
    });

    this.store.select(selectLeaveData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allLeaveRequest = data ? structuredClone(data) : [];
      this.leaveRequest = this.service.changePage(this.allLeaveRequest);
    });

    this.store.select(selectLeaveHistory)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allLeaveHistory = data ? structuredClone(data) : [];
      this.leaveHistory = this.service.changePage(this.allLeaveHistory);
    });

    this.store.dispatch(loadLeaveStatusRequestForm({ employeeID: this.employeeID }));
    this.store.select(selectLeaveStatusRequestForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {this.leaveStatusRequestOptions = data || []});

    this.store.dispatch(loadRepresentatives());
    this.store.select(selectRepresentatives)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {this.representOptions = data || []});

    this.store.dispatch(loadCountry());
    this.store.select(selectCountry)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {this.coutryOptions = data || []});

    //hii ya kuselect data moja na kuipeleka katika form na kuonekana
    this.store.dispatch(loadPersonalDetail({ employeeID: this.employeeID }));
    this.store.select(selectPersonalDetail)
    .pipe(
      takeUntil(this.destroy$),
      filter(data => !!data)
    )
    .subscribe(data => {
      this.employeePhoneNo = data.phone_no;
    });
    //file download pdf
    this.actions$.pipe(
      ofType(loadLeaveLetterSuccess,loadLeaveReturnedToWorkLetterSuccess),
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

  loadLeaveRequest(): void {
    this.store.dispatch(fetchLeaveData());
  }
  loadLeaveHistory(): void {
    this.store.dispatch(loadLeaveHistoryData({ employeeID: this.employeeID }));
  }
  onNavChange(changeEvent: NgbNavChangeEvent) {
    if (changeEvent.nextId === 1) {
      this.loadLeaveRequest();
    }
    if (changeEvent.nextId === 2) {
      this.loadLeaveHistory();
    }
  }


  openModalAddLeave() {
    const modalRef = this.modalService.open(LeaveRequestEmployeeFormComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.leaveStatusRequestOptions = this.leaveStatusRequestOptions;
    modalRef.componentInstance.representOptions = this.representOptions;
    modalRef.componentInstance.coutryOptions = this.coutryOptions;
    modalRef.componentInstance.employeePhoneNo = this.employeePhoneNo;
    modalRef.componentInstance.roleID = this.roleID;
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: LeaveRequestPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addLeave({ newData: payload }));
      modalRef.close();
    });
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }

  openModalReturnToLeave(leaveRequestID: number, endDate: string) {
    const modalRef = this.modalService.open(ReturnToLeaveRequestEmployeeFormComponent, { size: 'md', centered: true });
    modalRef.componentInstance.endDate = endDate; // 👈 muhimu
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const payload: LeaveReturnToWorkPayload = {
        leave_request_id: leaveRequestID,
        ...data
      };
      this.store.dispatch(addLeaveReturnToWork({ newData: payload }));
      modalRef.close();
    });
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }
  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    //ADD LEAVE
    [addLeaveSuccess.type]: {icon: 'success',title: 'Leave submitted',closeModal: true,timer: 2000},
    [addLeaveFailure.type]: {icon: 'error',title: 'Leave failed'},
    //RETURN TO WORK
    [addLeaveReturnToWorkSuccess.type]: {icon: 'success',title: 'Return To Leave submitted',closeModal: true,timer: 2000},
    [addLeaveReturnToWorkFailure.type]: {icon: 'error',title: 'Return To Leave failed'},
    //DELETE
    [deleteLeaveSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteLeaveFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllLeaveActions(): void {
    this.actions$.pipe(
      ofType(
        addLeaveSuccess,addLeaveFailure,addLeaveReturnToWorkSuccess,addLeaveReturnToWorkFailure,deleteLeaveSuccess,deleteLeaveFailure
      ),
      takeUntil(this.destroy$)
    ).subscribe((action: any) => {
      const config = this.actionMessages[action.type];
      if (!config) return;
      Swal.fire({
        icon: config.icon,
        title: config.title,
        text: action.error || '',
        timer: config.timer || undefined
      });
      //close modal only if needed
      if (config.closeModal) {
        this.modalService.dismissAll();
      }
    });
  }
  //ujumbe unaokuja ndio huu hapa end

  //delete start
  confirm(content: any, id: number): void {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  deleteData(): void {
    this.store.dispatch(deleteLeave({ leave_request_id: this.deleteId }));
  }
  //delete end

  //preview data start
  openAttachment(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }
  printLeaveLetter(id: number): void {
    const loader = document.getElementById('elmLoader');
    if (loader) {
      loader.classList.remove('d-none'); // 👈 show loader
    }
    this.store.dispatch(loadLeaveLetter({ id }));
  }
  printLeaveReturnedToWorkLetter(id: number): void {
    const loader = document.getElementById('elmLoader');
    if (loader) {
      loader.classList.remove('d-none'); // 👈 show loader
    }
    this.store.dispatch(loadLeaveReturnedToWorkLetter({ id }));
  }
  //preview data end

  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.leaveRequest = this.service.changePage(
      this.allLeaveRequest.filter(item =>
        item.leave_type.toLowerCase().includes(term) ||
        item.proposed_start_date.toLowerCase().includes(term)
      )
    );
    this.leaveHistory = this.service.changePage(
      this.allLeaveHistory.filter(item =>
        item.leave_type.toLowerCase().includes(term) ||
        item.start_date.toLowerCase().includes(term)

      )
    );
  }
  changePage(): void {
    this.leaveRequest = this.service.changePage(this.allLeaveRequest);
    this.leaveHistory = this.service.changePage(this.allLeaveHistory);
  }
  onSort(column: any): void {
    this.leaveRequest = this.service.onSort(column, this.leaveRequest);
    this.leaveHistory = this.service.onSort(column, this.leaveHistory);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
