import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { fetchNextOfKinsData, loadNextOfKinForm, addNextOfKin, addNextOfKinSuccess, addNextOfKinFailure, deleteNextOfKinSuccess, deleteNextOfKinFailure, deleteNextOfKin } from 'src/app/store/Profile_store/profile_action';
import { ProfileNextOfKinPayload } from 'src/app/store/Profile_store/profile_model';
import { selectProfileLoading, selectNextOfKinData, selectNextOfKinsForm } from 'src/app/store/Profile_store/profile_selector';
import Swal from 'sweetalert2';
import { NextOfKinsFormComponent } from './next-of-kins-form/next-of-kins-form.component';

@Component({
  selector: 'app-next-of-kins',
  templateUrl: './next-of-kins.component.html',
  styleUrl: './next-of-kins.component.scss'
})
export class NextOfKinsComponent implements OnInit,OnDestroy{
  employeeNextofKins: any[] = [];
  allEmployeeNextofKins: any[] = [];

  isLoading = true;
  employeeID: any;
  deleteId!: number;
  searchTerm = '';

  relationList: any[] = [];

  // For unsubscribing
  private destroy$ = new Subject<void>();
  constructor(
    private modalService: NgbModal, 
    private actions$: Actions,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>, 
    public service: PaginationService,
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.employeeID = user.personalInformationID;
    this.loadNextofKins();
    this.listenAllNextofKinsActions();
  }

  private loadNextofKins(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    //Next of Kins
    this.store.dispatch(fetchNextOfKinsData({ employeeID: this.employeeID }));
    this.store.select(selectNextOfKinData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allEmployeeNextofKins = data ? structuredClone(data) : [];
      this.employeeNextofKins = this.service.changePage(this.allEmployeeNextofKins);
    });

    this.store.dispatch(loadNextOfKinForm());
    this.store.select(selectNextOfKinsForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.relationList = data || []);

  }

  openModal(): void {
    const modalRef = this.modalService.open(NextOfKinsFormComponent, { size: 'lg', centered: true});
    modalRef.componentInstance.relationList = this.relationList;
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: ProfileNextOfKinPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addNextOfKin({ newData: payload }));
      modalRef.close();
    });
    // close
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }

  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    //ADD Next of Kins
    [addNextOfKinSuccess.type]: {icon: 'success',title: 'Next of Kins submitted',closeModal: true,timer: 2000},
    [addNextOfKinFailure.type]: {icon: 'error',title: 'Next of Kins failed'},
    //DELETE
    [deleteNextOfKinSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteNextOfKinFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllNextofKinsActions(): void {
    this.actions$.pipe(
      ofType(
        addNextOfKinSuccess,addNextOfKinFailure,deleteNextOfKinSuccess,deleteNextOfKinFailure
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
    this.store.dispatch(deleteNextOfKin({ next_of_kin_id: this.deleteId }));
  }
  //delete end

  
  changePage(): void {
    this.employeeNextofKins = this.service.changePage(this.allEmployeeNextofKins);
  }
  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.employeeNextofKins = this.service.changePage(
      this.allEmployeeNextofKins.filter(item =>
        item.first_name.toLowerCase().includes(term) ||
        item.middle_name.toLowerCase().includes(term) ||
        item.last_name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.phone_no.toLowerCase().includes(term) ||
        item.relation_name.toLowerCase().includes(term)
      )
    );
  }
  onSort(column: any): void {
    this.employeeNextofKins = this.service.onSort(column, this.employeeNextofKins);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
