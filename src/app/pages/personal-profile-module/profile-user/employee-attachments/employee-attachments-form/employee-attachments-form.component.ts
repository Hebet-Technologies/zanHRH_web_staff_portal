import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { RootReducerState } from 'src/app/store';
import { selectAttachmentsData } from 'src/app/store/Profile_store/profile_selector';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { deleteAttachment } from 'src/app/store/Profile_store/profile_action';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';

@Component({
  selector: 'app-employee-attachments-form',
  templateUrl: './employee-attachments-form.component.html',
  styleUrl: './employee-attachments-form.component.scss'
})
export class EmployeeAttachmentsFormComponent implements OnInit, OnDestroy{
  @Input() educationLevel: any[] = [];
  @Input() attachmentsUploadType: any[] = [];

  // receive function kutoka parent
  @Input() onLevelChange!: (levelId: number) => void;
  
  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  attachmentsUploadTypeForm!: UntypedFormGroup;
  submitted = false;
  selectedFile: File | null = null;
  searchTerm = '';
  employeeAttachments: any[] = [];
  deleteId!: number;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private modalService: NgbModal, 
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>) {}

  ngOnInit(): void {
    this.initForm();

    this.store.select(selectAttachmentsData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.employeeAttachments = data || []);
  }

  private initForm(): void {
    this.attachmentsUploadTypeForm = this.fb.group({
      educationLevelID: [null, Validators.required],
      attachmentsUploadTypeID: [null, Validators.required],
      uploadAttachmentsType: [null, Validators.required]

    });
  }

  get form() {
    return this.attachmentsUploadTypeForm.controls;
  }


  onEducationChange(event: any) {
    const levelId = event?.education_level_id;
    // reset program
    this.attachmentsUploadTypeForm.patchValue({ attachmentsUploadTypeID: null });
    if (!levelId) {
      this.attachmentsUploadType = []; // clear UI
      return;
    }
    // call parent function
    if (this.onLevelChange) {
      this.onLevelChange(levelId);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');
      event.target.value = ''; this.selectedFile = null; this.attachmentsUploadTypeForm.get('uploadAttachmentsType')?.setValue(null);
      return;
    }
    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null; this.attachmentsUploadTypeForm.get('uploadAttachmentsType')?.setValue(null);
      return;
    }
    this.selectedFile = file;
    this.form['uploadAttachmentsType'].setValue(file);
  }

  saveAttachmentsUploadType(): void {
    this.submitted = true;
    if (this.attachmentsUploadTypeForm.invalid) return;

    const payload = {
      upload_type_id: this.form['attachmentsUploadTypeID'].value,
      upload_file_name: this.selectedFile || undefined
    };

    this.submitForm.emit(payload);

    // Reset upload type & file but keep education level
    const currentEducationLevel = this.form['educationLevelID'].value;
    this.attachmentsUploadTypeForm.reset({
      educationLevelID: currentEducationLevel,
      attachmentsUploadTypeID: null,
      uploadAttachmentsType: null
    });
    // Reset file input manually
    const fileInput = document.getElementById('formFile') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    this.selectedFile = null;
    this.submitted = false;

    // ✅ Trigger reload ya upload type automatically
    if (currentEducationLevel) {
      this.onLevelChange(currentEducationLevel);
    }
  }

  openAttachment(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }

  //delete start
  confirm(content: any, id: number): void {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  deleteData(): void {
    this.store.dispatch(deleteAttachment({ employee_attachment_id: this.deleteId }));
  }
  //delete end
  closeModal() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
