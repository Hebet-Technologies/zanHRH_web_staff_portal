import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, take, takeUntil } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { addEducation, addEducationFailure, addEducationSuccess, deleteEducation, deleteEducationFailure, deleteEducationSuccess, fetchEducationData, loadEducationLevel, loadInstitute, loadInstituteCountry, loadProgramByEducationLevel } from 'src/app/store/Profile_store/profile_action';
import { selectProfileLoading, selectEducationData, selectEducationLevel, selectProgramByEducationLevel, selectInstituteCountry, selectInstitutes } from 'src/app/store/Profile_store/profile_selector';
import Swal from 'sweetalert2';
import { EducationEmployeeFormComponent } from './education-employee-form/education-employee-form.component';
import { ProfileEducationPayload } from 'src/app/store/Profile_store/profile_model';

@Component({
  selector: 'app-education-profile',
  templateUrl: './education-profile.component.html',
  styleUrl: './education-profile.component.scss'
})
export class EducationProfileComponent implements OnInit,OnDestroy{

  employeeEducation: any[] = [];
  allEmployeeEdication: any[] = [];

  isLoading = true;
  employeeID: any;
  deleteId!: number;
  searchTermEdu = '';

  //data
  educationLevel: any[] = [];
  programs: any[] = [];
  selectedLevelId!: number;
  instituteCountry: any[] = [];
  institutes: any[] = [];

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

    this.loadEducation();
    this.listenAllEducationActions();
  }
  
  private loadEducation(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    //education
    this.store.dispatch(fetchEducationData({ employeeID: this.employeeID }));
    this.store.select(selectEducationData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allEmployeeEdication = data ? structuredClone(data) : [];
      this.employeeEducation = this.service.changePage(this.allEmployeeEdication);
    });

    this.store.dispatch(loadEducationLevel());
    this.store.select(selectEducationLevel)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.educationLevel = data || []);

    this.store.select(selectProgramByEducationLevel)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.programs = data || []);

    this.store.dispatch(loadInstituteCountry());
    this.store.select(selectInstituteCountry)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.instituteCountry = data || []);

    this.store.select(selectInstitutes)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.institutes = data || []);


  }
  // Function ya kuchange education level
  onEducationLevelChange(educationLevel: number) {
    this.selectedLevelId = educationLevel;
    this.programs = [];
    this.store.dispatch(loadProgramByEducationLevel({ educationLevel }));
  }
  onCountryAndLevelChange(countryId: number) {
    const selectedCountry = this.instituteCountry.find(c => c.country_id === countryId);
    const countryCode = selectedCountry?.country_code;
    const educationLevel = this.selectedLevelId;
    if (!countryCode || !educationLevel) {
      this.institutes = [];
      return;
    }
    this.store.dispatch(loadInstitute({ countryCode, educationLevel }));
  }


  openModal(): void {
    const modalRef = this.modalService.open(EducationEmployeeFormComponent, { size: 'lg', centered: true});
    // send data
    modalRef.componentInstance.educationLevel = this.educationLevel;
     // muhimu sana
    modalRef.componentInstance.programs = this.programs;
    modalRef.componentInstance.onLevelChange = (levelId: number) => {
      this.onEducationLevelChange(levelId);
    };
    // subscribe once (reactive update)
    this.store.select(selectProgramByEducationLevel)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.programs = data || [];
      modalRef.componentInstance.programs = this.programs;
    });
    modalRef.componentInstance.instituteCountry = this.instituteCountry;
    modalRef.componentInstance.onCountryChange = (countryId: number) => {
      this.onCountryAndLevelChange(countryId);
    };
    // send institutes
    modalRef.componentInstance.institutes = this.institutes;
    // reactive update
    this.store.select(selectInstitutes)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.institutes = data || [];
      modalRef.componentInstance.institutes = this.institutes;
    });

    // listen submit
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: ProfileEducationPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addEducation({ newData: payload }));
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
    [addEducationSuccess.type]: {icon: 'success',title: 'Education Background submitted',closeModal: true,timer: 2000},
    [addEducationFailure.type]: {icon: 'error',title: 'Education Background failed'},
    //DELETE
    [deleteEducationSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteEducationFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllEducationActions(): void {
    this.actions$.pipe(
      ofType(
        addEducationSuccess,addEducationFailure,deleteEducationSuccess,deleteEducationFailure
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
    this.store.dispatch(deleteEducation({ education_details_id: this.deleteId }));
  }
  //delete end

  changePage(): void {
    this.employeeEducation = this.service.changePage(this.allEmployeeEdication);
  }
  performSearch(): void {
    const educationTerm = this.searchTermEdu.toLowerCase();
    this.employeeEducation = this.service.changePage(
      this.allEmployeeEdication.filter(item =>
        item.education_level_name.toLowerCase().includes(educationTerm) ||
        item.program_name.toLowerCase().includes(educationTerm)
      )
    );
  }
  onSort(column: any): void {
    this.employeeEducation = this.service.onSort(column, this.employeeEducation);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
