import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { fetchRefereesData, addRefereeSuccess, addRefereeFailure, deleteRefereeSuccess, deleteRefereeFailure, deleteReferee, loadDistrictForm, loadEducationLevel, loadShehiaForm, loadIdentificationTypeForm, addReferee } from 'src/app/store/Profile_store/profile_action';
import { selectDistrictForm, selectIdentitiesTypeForm, selectProfileLoading, selectRefereeData, selectShehiaForm } from 'src/app/store/Profile_store/profile_selector';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RefereeFormComponent } from './referee-form/referee-form.component';
import { ProfileRefereePayload } from 'src/app/store/Profile_store/profile_model';

@Component({
  selector: 'app-referees',
  templateUrl: './referees.component.html',
  styleUrl: './referees.component.scss'
})
export class RefereesComponent implements OnInit,OnDestroy{
  employeeReferees: any[] = [];
  allEmployeeReferee: any[] = [];

  isLoading = true;
  employeeID: any;
  deleteId!: number;
  searchTerm = '';

  districtList: any[] = [];
  shehiaList: any[] = [];
  identityList: any[] = [];
  selectedDistrictId!: number;

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
    this.loadReferee();
    this.listenAllRefereeActions();
  }

  private loadReferee(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    //Hobbies
    this.store.dispatch(fetchRefereesData({ employeeID: this.employeeID }));
    this.store.select(selectRefereeData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allEmployeeReferee = data ? structuredClone(data) : [];
      this.employeeReferees = this.service.changePage(this.allEmployeeReferee);
    });

    this.store.dispatch(loadDistrictForm());
    this.store.select(selectDistrictForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.districtList = data || []);

    this.store.select(selectShehiaForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.shehiaList = data || []);

    this.store.dispatch(loadIdentificationTypeForm());
    this.store.select(selectIdentitiesTypeForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.identityList = data || []);

  }

  // Function ya kuchange district
  onDistrictChangeData(districtIDs: number) {
    this.selectedDistrictId = districtIDs;
    this.shehiaList = [];
    this.store.dispatch(loadShehiaForm({ districtIDs }));
  }

  openModal(): void {
    const modalRef = this.modalService.open(RefereeFormComponent, { size: 'lg', centered: true});
    modalRef.componentInstance.districtList = this.districtList;
    modalRef.componentInstance.shehiaList = this.shehiaList;
    modalRef.componentInstance.onDistrictChange = (districtIDs: number) => {
      this.onDistrictChangeData(districtIDs);
    };
    // subscribe once (reactive update)
    this.store.select(selectShehiaForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.shehiaList = data || [];
      modalRef.componentInstance.shehiaList = this.shehiaList;
    });

    modalRef.componentInstance.identityList = this.identityList;

    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: ProfileRefereePayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addReferee({ newData: payload }));
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
    [addRefereeSuccess.type]: {icon: 'success',title: 'Referee submitted',closeModal: true,timer: 2000},
    [addRefereeFailure.type]: {icon: 'error',title: 'Referee failed'},
    //DELETE
    [deleteRefereeSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteRefereeFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllRefereeActions(): void {
    this.actions$.pipe(
      ofType(
        addRefereeSuccess,addRefereeFailure,deleteRefereeSuccess,deleteRefereeFailure
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
    this.store.dispatch(deleteReferee({ refferee_id: this.deleteId }));
  }
  //delete end

  openAttachmentSkills(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }
  changePage(): void {
    this.employeeReferees = this.service.changePage(this.allEmployeeReferee);
  }
  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.employeeReferees = this.service.changePage(
      this.allEmployeeReferee.filter(item =>
        item.refferee_phone.toLowerCase().includes(term)
      )
    );
  }
  onSort(column: any): void {
    this.employeeReferees = this.service.onSort(column, this.employeeReferees);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
