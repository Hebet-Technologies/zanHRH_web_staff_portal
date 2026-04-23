import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-transfer-request-form',
  templateUrl: './employee-transfer-request-form.component.html',
  styleUrl: './employee-transfer-request-form.component.scss'
})
export class EmployeeTransferRequestFormComponent implements OnInit, OnDestroy{
  @Input() workStationOptions: any[] = [];
  @Input() transfereReasons: any[] = [];

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  employeeTransferForm!: UntypedFormGroup;
  submitted = false;
  showUploadField = false;
  selectedFile: File | null = null;

  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.handleTransferReasonChange();
  }

  private initForm(): void {
    this.employeeTransferForm = this.fb.group({
      workingStationID: [null, Validators.required],
      transfereReasonsID: [null, Validators.required],
      uploadReason: [null]
    });
  }

  get form() {
    return this.employeeTransferForm.controls;
  }

  private handleTransferReasonChange(): void {
    this.employeeTransferForm.get('transfereReasonsID')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(reasonId => {
        const selectedReason = this.transfereReasons.find(r => r.transfer_reason_id === reasonId);

        if (selectedReason?.need_upload) {
          this.showUploadField = true;
          this.form['uploadReason'].setValidators([Validators.required]);
        } else {
          this.showUploadField = false;
          this.form['uploadReason'].clearValidators();
          this.form['uploadReason'].setValue(null);
        }
        this.form['uploadReason'].updateValueAndValidity();
      });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');
      event.target.value = ''; this.selectedFile = null; this.employeeTransferForm.get('uploadReason')?.setValue(null);
      return;
    }

    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null; this.employeeTransferForm.get('uploadReason')?.setValue(null);
      return;
    }

    this.selectedFile = file;
    this.form['uploadReason'].setValue(file);
  }

  saveTransfer(): void {
    this.submitted = true;
    if (this.employeeTransferForm.invalid) return;

    const payload = {
      working_station_id_to: this.form['workingStationID'].value,
      transfer_reason_id: this.form['transfereReasonsID'].value,
      upload_file_name: this.selectedFile || undefined
    };

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
