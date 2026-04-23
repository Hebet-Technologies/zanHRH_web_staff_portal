import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { addEmployeeTransfer, addEmployeeTransferFailure, addEmployeeTransferSuccess, deleteEmployeeTransfer, deleteEmployeeTransferFailure, deleteEmployeeTransferSuccess, fetchEmployeeTransferData, loadTransferReasons, loadWorkStations } from 'src/app/store/Transfer_store/transfer_action';
import { selectEmployeeTransferLoading, selectEmployeeTransferData, selectWorkStations, selectTransferReasons } from 'src/app/store/Transfer_store/transfer_selector';
import { Actions, ofType } from '@ngrx/effects';

// Sweet Alert
import Swal from 'sweetalert2';
import { TransferRequestPayload } from 'src/app/store/Transfer_store/transfer_model';
import { environment } from 'src/environments/environment';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { EmployeeTransferRequestFormComponent } from './employee-transfer-request-form/employee-transfer-request-form.component';
import { TableService } from 'src/app/core/services/table.service';

@Component({
  selector: 'app-employee-transfer-request',
  templateUrl: './employee-transfer-request.component.html',
  styleUrl: './employee-transfer-request.component.scss',
  providers: [TableService] 
})
export class EmployeeTransferRequestComponent implements OnInit, OnDestroy {
  breadCrumbItems!: Array<{}>;
  workStationOptions: any[] = [];
  transfereReasons: any[] = [];
  deleteId!: number;

  searchTerm = '';
  pageSizes = [5, 10, 20, 50, 100, 'All'];

  private destroy$ = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private actions$: Actions,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>,
    public table: TableService<any>,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Transfer' },
      { label: 'Request Transfer', active: true }
    ];

    this.loadTransferRequest();
    this.listenAllTransferActions();
  }

  loadTransferRequest(): void {
    // Handle loading state
    this.store.select(selectEmployeeTransferLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        if (!loading) {
          const loader = document.getElementById('elmLoader');
          if (loader) {
            loader.classList.add('d-none');
          }
        }
      });

    this.store.dispatch(fetchEmployeeTransferData());
    this.store.select(selectEmployeeTransferData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.table.setData(data || []); //hii ndio data inaenda katika table ili mtu aweze kuona data
    });

    this.store.dispatch(loadWorkStations());
    this.store.select(selectWorkStations)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.workStationOptions = data || []);

    this.store.dispatch(loadTransferReasons());
    this.store.select(selectTransferReasons)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.transfereReasons = data || []);
  }

  openModal(): void {
    const modalRef = this.modalService.open(EmployeeTransferRequestFormComponent, { size: 'md', centered: true});
    // send data
    modalRef.componentInstance.workStationOptions = this.workStationOptions;
    modalRef.componentInstance.transfereReasons = this.transfereReasons;
    // listen submit
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: TransferRequestPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addEmployeeTransfer({ newData: payload }));
      modalRef.close();
    });
    // close
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }

  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    //ADD transfer
    [addEmployeeTransferSuccess.type]: {icon: 'success',title: 'Transfer submitted',closeModal: true,timer: 2000},
    [addEmployeeTransferFailure.type]: {icon: 'error',title: 'Transfer failed'},
    //DELETE
    [deleteEmployeeTransferSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteEmployeeTransferFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllTransferActions(): void {
    this.actions$.pipe(
      ofType(
        addEmployeeTransferSuccess,addEmployeeTransferFailure,deleteEmployeeTransferSuccess,deleteEmployeeTransferFailure
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
    this.store.dispatch(deleteEmployeeTransfer({ transfer_request_id: this.deleteId }));
  }
  //delete end

  openAttachment(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }

  // SEARCH start
  performSearch() {
    this.table.search(this.searchTerm, [
      'post_category_name',
      'transfer_from',
      'transfer_to',
      'transfer_reason_name'
    ]);
  }
  onSort(column: string) {
    this.table.sort(column as any);
  }
  //end search

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
