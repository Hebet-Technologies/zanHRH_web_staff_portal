import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-leave-request-employee-form',
  templateUrl: './leave-request-employee-form.component.html',
  styleUrl: './leave-request-employee-form.component.scss'
})
export class LeaveRequestEmployeeFormComponent implements OnInit, OnDestroy{
  @Input() leaveStatusRequestOptions: any[] = [];
  @Input() representOptions: any[] = [];
  @Input() coutryOptions: any[] = [];
  @Input() employeePhoneNo!: string;
  @Input() roleID!: number;

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  leaveRequestForm!: UntypedFormGroup;
  submitted = false;

  showUploadField = false;
  showNoDayField = false;
  showRepresentativesField = false;
  showPlaceToTravelField = false;

  selectedFile!: File | null;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleChanges();

    if (this.roleID != 7) {
      this.showRepresentativesField = true;
      this.leaveRequestForm.get('representativeID')?.setValidators([Validators.required]);
    }
  }

  private initForm(): void {
    this.leaveRequestForm = this.fb.group({
      employementStatusID: [null, Validators.required],
      uploadReason: [null],
      proposedStartDate: [null, Validators.required],
      // contactOnLeave: [this.employeePhoneNo, Validators.required],
      contactOnLeave: [this.employeePhoneNo, [Validators.required,Validators.pattern(/^(\+255\d{9}|0\d{9})$/)]],

      numberOfDays: [null],
      representativeID: [null],
      travelOutsideCountry: [null, Validators.required],
      placeToTravel: [null],
    });
  }

  get form() {
    return this.leaveRequestForm.controls;
  }

  private handleChanges(): void {

    this.leaveRequestForm.get('employementStatusID')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(statusID => {

      const selected = this.leaveStatusRequestOptions.find(
        r => r.employement_status_id === statusID
      );

      // upload
      if (selected?.need_upload) {
        this.showUploadField = true;
        this.form['uploadReason'].setValidators([Validators.required]);
      } else {
        this.showUploadField = false;
        this.form['uploadReason'].clearValidators();
        this.form['uploadReason'].setValue(null);
      }
      this.form['uploadReason'].updateValueAndValidity();

      // number of days
      if (selected?.need_end_date) {
        this.showNoDayField = true;
        this.form['numberOfDays'].setValidators([Validators.required]);
      } else {
        this.showNoDayField = false;
        this.form['numberOfDays'].clearValidators();
        this.form['numberOfDays'].setValue(null);
      }
      this.form['numberOfDays'].updateValueAndValidity();
    });

    // travel
    this.leaveRequestForm.get('travelOutsideCountry')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(value => {
      if (value == 1) {
        this.showPlaceToTravelField = true;
        this.form['placeToTravel'].setValidators([Validators.required]);
      } else {
        this.showPlaceToTravelField = false;
        this.form['placeToTravel'].clearValidators();
        this.form['placeToTravel'].setValue(null);
      }
      this.form['placeToTravel'].updateValueAndValidity();
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');  
      event.target.value = ''; this.selectedFile = null; this.leaveRequestForm.get('uploadReason')?.setValue(null);   
      return;
    }

    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null; this.leaveRequestForm.get('uploadReason')?.setValue(null);   
      return;
    }

    this.selectedFile = file;
    this.form['uploadReason'].setValue(file);
  }

  saveLeaveRequest(): void {
    this.submitted = true;
    if (this.leaveRequestForm.invalid) return;

    const formValue = this.leaveRequestForm.value;
    const payload = {
      employement_status_id: formValue.employementStatusID,
      proposed_start_date: this.datePipe.transform(formValue.proposedStartDate, 'yyyy-MM-dd'),
      number_of_days: formValue.numberOfDays,
      contact_on_leave: formValue.contactOnLeave,
      place_to_travel: formValue.placeToTravel,
      representative_id: formValue.representativeID,
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
