import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-training-request-form',
  templateUrl: './employee-training-request-form.component.html',
  styleUrl: './employee-training-request-form.component.scss'
})
export class EmployeeTrainingRequestFormComponent implements OnInit, OnDestroy{
  @Input() instituteCountry: any[] = [];
  @Input() institutes: any[] = [];
  @Input() rowSelected: any;

    // receive function kutoka parent
  @Input() onCountryChange!: (countryId: number) => void;

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  trainingRequestForm!: UntypedFormGroup;
  submitted = false;

  private destroy$ = new Subject<void>();
  minDate!: Date;
  minEndDate!: Date;
  selectedFile: File | null = null;
  showUploadField = false;

  constructor(
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.handleCountryChange();
    // this.minDate = new Date(this.endDate); // 👈 kutoka API
    this.minDate = new Date(); // 👈 today
    this.handleDateChanges(); // 👈 muhimu
    this.handAdmissionleLater(); // 👈 muhimu
  }

  private initForm(): void {
    this.trainingRequestForm = this.fb.group({
      countryID: [null, Validators.required],
      instituteID: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      uploadAdmissionLater: [null]

    });
  }

  get form() {
    return this.trainingRequestForm.controls;
  }

  // Country ValueChanges (HII NDIO ULIYOULIZA)
  private handleCountryChange(): void {
    this.trainingRequestForm.get('countryID')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((countryId: number) => {
      // reset institute
      this.trainingRequestForm.patchValue({instituteID: null});
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

  private handleDateChanges(): void {
    // START DATE CHANGE
    this.trainingRequestForm.get('startDate')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((start: Date) => {
      if (!start) return;
      // endDate inaanza hapa
      this.minEndDate = start;
      const end = this.trainingRequestForm.get('endDate')?.value;
      // kama endDate iko nyuma ya startDate → clear
      if (end && new Date(end) < new Date(start)) {
        this.trainingRequestForm.patchValue({ endDate: null });
      }
    });

    // END DATE CHANGE
    this.trainingRequestForm.get('endDate')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((end: Date) => {
      const start = this.trainingRequestForm.get('startDate')?.value;
      if (!end || !start) return;
      // safety check
      if (new Date(end) < new Date(start)) {
        this.trainingRequestForm.patchValue({ endDate: null });
      }
    });
  }

  private handAdmissionleLater(): void {
    if (this.rowSelected?.is_short_course) {
      this.showUploadField = true;
      this.form['uploadAdmissionLater'].setValidators([Validators.required]);
    
    } else {
      this.showUploadField = false;
      this.form['uploadAdmissionLater'].clearValidators();
      this.form['uploadAdmissionLater'].setValue(null);
    }
    this.form['uploadAdmissionLater'].updateValueAndValidity();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');
      event.target.value = ''; this.selectedFile = null; this.trainingRequestForm.get('uploadAdmissionLater')?.setValue(null);
      return;
    }
    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null; this.trainingRequestForm.get('uploadAdmissionLater')?.setValue(null);
      return;
    }
    this.selectedFile = file;
    this.form['uploadAdmissionLater'].setValue(file);
  }
  
  saveTrainingForm(): void {
    this.submitted = true;
    if (this.trainingRequestForm.invalid) return;

    const formValue = this.trainingRequestForm.value;
    const payload = {
      development_plan_vendor_id: this.rowSelected.development_plan_vendor_id,
      institute_id: formValue.instituteID,
      start_date: this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd'),
      end_date: this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd'),
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
