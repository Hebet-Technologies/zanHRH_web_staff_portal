import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { addWorkExperience, addWorkExperienceFailure, addWorkExperienceSuccess, deleteWorkExperience, deleteWorkExperienceFailure, deleteWorkExperienceSuccess, fetchWorkExperienceData } from 'src/app/store/Profile_store/profile_action';
import { selectProfileLoading, selectWorkExperienceData } from 'src/app/store/Profile_store/profile_selector';
import { environment } from 'src/environments/environment';
import { WorkExperienceProfileFormComponent } from './work-experience-profile-form/work-experience-profile-form.component';
import { ProfileWorkExperiencePayload } from 'src/app/store/Profile_store/profile_model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-work-experience-profile',
  templateUrl: './work-experience-profile.component.html',
  styleUrl: './work-experience-profile.component.scss'
})
export class WorkExperienceProfileComponent implements OnInit,OnDestroy{
  employeeWorkExperience: any[] = [];
  allEmployeeWorkExperience: any[] = [];

  isLoading = true;
  employeeID: any;
  deleteId!: number;
  searchTermWork = '';

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
    this.loadWorkExperience();
    this.listenAllWorkExperienceActions();
  }

  private loadWorkExperience(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    //WorkExperience
    this.store.dispatch(fetchWorkExperienceData({ employeeID: this.employeeID }));
    this.store.select(selectWorkExperienceData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allEmployeeWorkExperience = data ? structuredClone(data) : [];
      this.employeeWorkExperience = this.service.changePage(this.allEmployeeWorkExperience);
    });

  }

  openModal(): void {
    const modalRef = this.modalService.open(WorkExperienceProfileFormComponent, { size: 'lg', centered: true});
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: ProfileWorkExperiencePayload = {
        personal_information_id: user.personalInformationID,
        experience_id: null,
        ...data
      };
      this.store.dispatch(addWorkExperience({ newData: payload }));
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
    [addWorkExperienceSuccess.type]: {icon: 'success',title: 'WorkExperience submitted',closeModal: true,timer: 2000},
    [addWorkExperienceFailure.type]: {icon: 'error',title: 'WorkExperience failed'},
    //DELETE
    [deleteWorkExperienceSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteWorkExperienceFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllWorkExperienceActions(): void {
    this.actions$.pipe(
      ofType(
        addWorkExperienceSuccess,addWorkExperienceFailure,deleteWorkExperienceSuccess,deleteWorkExperienceFailure
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
    this.store.dispatch(deleteWorkExperience({ experience_id: this.deleteId }));
  }
  //delete end

  openAttachmentWorkExperience(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }
  changePage(): void {
    this.employeeWorkExperience = this.service.changePage(this.allEmployeeWorkExperience);
  }
  performSearch(): void {
    const workExperienceTerm = this.searchTermWork.toLowerCase();
    this.employeeWorkExperience = this.service.changePage(
      this.allEmployeeWorkExperience.filter(item =>
        item.employer_name.toLowerCase().includes(workExperienceTerm) ||
        item.experience_position.toLowerCase().includes(workExperienceTerm)
      )
    );
  }
  onSort(column: any): void {
    this.employeeWorkExperience = this.service.onSort(column, this.employeeWorkExperience);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
