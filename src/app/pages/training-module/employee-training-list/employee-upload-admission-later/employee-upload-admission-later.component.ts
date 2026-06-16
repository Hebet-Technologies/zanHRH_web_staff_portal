import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-upload-admission-later',
  templateUrl: './employee-upload-admission-later.component.html',
  styleUrl: './employee-upload-admission-later.component.scss'
})
export class EmployeeUploadAdmissionLaterComponent implements OnInit,OnDestroy{
  @Input() instituteCountry: any[] = [];
  @Input() institutes: any[] = [];
  @Input() rowSelected: any;

    // receive function kutoka parent
  @Input() onCountryChange!: (countryId: number) => void;

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  uploadtrainingAdmisionLaterForm!: UntypedFormGroup;
  submitted = false;

  private destroy$ = new Subject<void>();
  // minDate!: Date;
  // minEndDate!: Date;
  selectedFile: File | null = null;
  showUploadField = false;

  constructor(
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleCountryChange();
  }

  private initForm(): void {
    this.uploadtrainingAdmisionLaterForm = this.fb.group({
      countryID: [null, Validators.required],
      instituteID: [null, Validators.required],
      uploadAdmissionLater: [null, Validators.required]
    });
  }

  get form() {
    return this.uploadtrainingAdmisionLaterForm.controls;
  }

  // Country ValueChanges (HII NDIO ULIYOULIZA)
  private handleCountryChange(): void {
    this.uploadtrainingAdmisionLaterForm.get('countryID')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((countryId: number) => {
      // reset institute
      this.uploadtrainingAdmisionLaterForm.patchValue({instituteID: null});
      if (!countryId) {
        this.institutes = [];
        return;
      }
      // call parent
      if (this.onCountryChange) {
        this.onCountryChange(countryId);
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');
      event.target.value = ''; this.selectedFile = null; this.uploadtrainingAdmisionLaterForm.get('uploadAdmissionLater')?.setValue(null);
      return;
    }
    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null; this.uploadtrainingAdmisionLaterForm.get('uploadAdmissionLater')?.setValue(null);
      return;
    }
    this.selectedFile = file;
    this.form['uploadAdmissionLater'].setValue(file);
  }
  
  saveUploadAdmissionLaterForm(): void {
    this.submitted = true;
    if (this.uploadtrainingAdmisionLaterForm.invalid) return;

    const formValue = this.uploadtrainingAdmisionLaterForm.value;
    const payload = {
      training_application_id: this.rowSelected.training_application_id,
      institute_id: formValue.instituteID,
      training_app_status_id: this.rowSelected.training_app_status_id,
      admission_letter: this.selectedFile || undefined
    };
    console.log(payload)
    this.submitForm.emit(payload);
  }

  closeModal() {
    this.close.emit();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
