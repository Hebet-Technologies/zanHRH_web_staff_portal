import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { addTrainingForm, addTrainingFormFailure, addTrainingFormSuccess, deleteTrainingForm, deleteTrainingFormFailure, deleteTrainingFormSuccess, fetchEmployeeTrainingData, loadInstitute, loadInstituteCountry, loadTrainingAnnoucement } from 'src/app/store/Training_store/training_action';
import { selectEmployeeTrainingLoading, selectEmployeeTrainingData, selectTrainingAnnoucement, selectInstituteCountry, selectInstitutes } from 'src/app/store/Training_store/training_selector';
import { EmployeeTrainingRequestFormComponent } from './employee-training-request-form/employee-training-request-form.component';
import { TrainingRequestFormPayload } from 'src/app/store/Training_store/training_model';
import { deleteEmployeeTransfer } from 'src/app/store/Transfer_store/transfer_action';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-employee-training-list',
  templateUrl: './employee-training-list.component.html',
  styleUrl: './employee-training-list.component.scss'
})
export class EmployeeTrainingListComponent implements OnInit, OnDestroy{
  breadCrumbItems!: Array<{}>;
  // Data
  empTrainingList: any[] = [];
  allEmpTrainingList: any[] = [];
  searchTerm = '';
  existingTerm: any;

  deleteId!: number;
  isLoading = true;
  profileData: any;
  employeeID: any;

  trainingAnnoucementList: any[] = [];
  instituteCountry: any[] = [];
  institutes: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private modalService: NgbModal,
    private actions$: Actions,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>,
    public service: PaginationService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Training' },
      { label: 'Employee Training', active: true }
    ];
    const user = JSON.parse(localStorage.getItem('user')!);
    this.employeeID = user.personalInformationID;

    this.loadTrainingList();
    this.listenAllTrainingActions();
  }

  loadTrainingList(): void {
    // Handle loading state
    this.store.select(selectEmployeeTrainingLoading)
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
         this.isLoading = loading;
      });

    this.store.dispatch(fetchEmployeeTrainingData({ personal_informationID: this.employeeID }));
    this.store.select(selectEmployeeTrainingData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allEmpTrainingList = data ? structuredClone(data) : [];
      this.empTrainingList = this.service.changePage(this.allEmpTrainingList);
    });

    this.store.dispatch(loadTrainingAnnoucement());
    this.store.select(selectTrainingAnnoucement)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.trainingAnnoucementList = data || []);

    //formtraining list data
    this.store.dispatch(loadInstituteCountry());
    this.store.select(selectInstituteCountry)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.instituteCountry = data || []);

    this.store.select(selectInstitutes)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.institutes = data || []);

  }

  onInstituteCountryChange(countryId: number) {
    const selectedCountry = this.instituteCountry.find(c => c.country_id === countryId);
    const countryCode = selectedCountry?.country_code;
    if (!countryCode) {
      this.institutes = [];
      return;
    }
    this.store.dispatch(loadInstitute({ countryCode, educationLevel: undefined as any }));
  }

  openModalTrainingForm(data:any) {
    const modalRef = this.modalService.open(EmployeeTrainingRequestFormComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.rowSelected = data; 

    modalRef.componentInstance.instituteCountry = this.instituteCountry;
    modalRef.componentInstance.onCountryChange = (countryId: number) => {
      this.onInstituteCountryChange(countryId);
    };
    // send institutes
    modalRef.componentInstance.institutes = this.institutes;
    // reactive update
    this.store.select(selectInstitutes)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.institutes = data || [];
      if (modalRef.componentInstance) {
        modalRef.componentInstance.institutes = this.institutes;
      }
    });

    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: TrainingRequestFormPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addTrainingForm({ newData: payload }));
      modalRef.close();
    });
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }

  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    //ADD transfer
    [addTrainingFormSuccess.type]: {icon: 'success',title: 'Training submitted',closeModal: true,timer: 2000},
    [addTrainingFormFailure.type]: {icon: 'error',title: 'Training failed'},
    //DELETE
    [deleteTrainingFormSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteTrainingFormFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllTrainingActions(): void {
    this.actions$.pipe(
      ofType(
        addTrainingFormSuccess,addTrainingFormFailure,deleteTrainingFormSuccess,deleteTrainingFormFailure
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
    this.store.dispatch(deleteTrainingForm({ training_application_id: this.deleteId }));
  }
  //delete end

  openAttachment(fileName: string): void {
    const fileUrl = `${environment.trainingfileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }

  // currently selected row data
  selectedTraining: any = null;
  // open modal with row data
  openModalApplication(content: any, rowData: any, checkbox: HTMLInputElement) {
    checkbox.checked = true;
    this.selectedTraining = rowData; // save data ya row
    this.modalService.open(content, { size: 'md', centered: true }).result
      .finally(() => {
        checkbox.checked = false;
        this.selectedTraining = null;
      });
  }
  selectedTrainingAnnouncement: any = null;
  openModalAnnouncement(content: any, rowData: any, checkbox: HTMLInputElement) {
    this.selectedTrainingAnnouncement = rowData; // save data ya row
    this.modalService.open(content, { size: 'md', centered: true }).result
      .finally(() => {
        checkbox.checked = false;
        this.selectedTrainingAnnouncement = null;
      });
  }

  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.empTrainingList = this.service.changePage(
      this.allEmpTrainingList.filter(item =>
        item.cader_name.toLowerCase().includes(term) ||
        item.batch_year.toLowerCase().includes(term)
      )
    );
  }
  changePage(): void {
    this.empTrainingList = this.service.changePage(this.allEmpTrainingList);
  }
  onSort(column: any): void {
    this.empTrainingList = this.service.onSort(column, this.empTrainingList);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
