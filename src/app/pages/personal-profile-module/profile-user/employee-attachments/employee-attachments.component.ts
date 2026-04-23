import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { fetchAttachmentsData, addAttachmentSuccess, addAttachmentFailure, deleteAttachmentSuccess, deleteAttachmentFailure, deleteAttachment, loadEducationLevel, loadAttachmentsUploadType, addAttachment } from 'src/app/store/Profile_store/profile_action';
import { selectProfileLoading, selectAttachmentsData, selectEducationLevel, selectAttachmentsUploadTypeForm } from 'src/app/store/Profile_store/profile_selector';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { EmployeeAttachmentsFormComponent } from './employee-attachments-form/employee-attachments-form.component';
import { ProfileAttachmentsPayload } from 'src/app/store/Profile_store/profile_model';

@Component({
  selector: 'app-employee-attachments',
  templateUrl: './employee-attachments.component.html',
  styleUrl: './employee-attachments.component.scss'
})
export class EmployeeAttachmentsComponent implements OnInit,OnDestroy{
  employeeID: any;
  isLoading = true;
  imageUrl = environment.imagePath;
  deleteId!: number;

  employeeAttachments: any[] = [];
  educationLevel: any[] = [];
  attachmentsUploadType: any[] = [];
  selectedLevelId!: number;

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
    this.loadData();
    this.listenAllWorkExperienceActions();

  }

  private loadData(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    this.store.dispatch(fetchAttachmentsData({ employeeID: this.employeeID }));
    this.store.select(selectAttachmentsData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {this.employeeAttachments = data || []});

    this.store.dispatch(loadEducationLevel());
    this.store.select(selectEducationLevel)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.educationLevel = data || []);

    this.store.select(selectAttachmentsUploadTypeForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.attachmentsUploadType = data || []);
  
  }

  // Function ya kuchange education level
  onEducationLevelChange(educationLevel: number) {
    this.selectedLevelId = educationLevel;
    this.attachmentsUploadType = [];
    this.store.dispatch(loadAttachmentsUploadType({ educationLevel }));
  }

  openModal(): void {
    const modalRef = this.modalService.open(EmployeeAttachmentsFormComponent, { size: 'lg', centered: true});
    modalRef.componentInstance.educationLevel = this.educationLevel;
    modalRef.componentInstance.attachmentsUploadType = this.attachmentsUploadType;
    modalRef.componentInstance.onLevelChange = (levelId: number) => {
      this.onEducationLevelChange(levelId);
    };
    // subscribe once (reactive update)
    this.store.select(selectAttachmentsUploadTypeForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.attachmentsUploadType = data || [];
      modalRef.componentInstance.attachmentsUploadType = this.attachmentsUploadType;
    });

    // listen submit
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: ProfileAttachmentsPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addAttachment({ newData: payload }));
      // modalRef.close();
    });
    // close
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }


  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    //ADD Attachments
    [addAttachmentSuccess.type]: {icon: 'success',title: 'Attachments submitted',closeModal: false,timer: 2000},
    [addAttachmentFailure.type]: {icon: 'error',title: 'Attachments failed'},
    //DELETE
    [deleteAttachmentSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteAttachmentFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllWorkExperienceActions(): void {
    this.actions$.pipe(
      ofType(
        addAttachmentSuccess,addAttachmentFailure,deleteAttachmentSuccess,deleteAttachmentFailure
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
    this.store.dispatch(deleteAttachment({ employee_attachment_id: this.deleteId }));
  }
  //delete end


  openAttachment(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
