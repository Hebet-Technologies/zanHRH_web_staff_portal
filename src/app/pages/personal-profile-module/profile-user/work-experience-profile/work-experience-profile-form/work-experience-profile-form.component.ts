import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-work-experience-profile-form',
  templateUrl: './work-experience-profile-form.component.html',
  styleUrl: './work-experience-profile-form.component.scss'
})
export class WorkExperienceProfileFormComponent implements OnInit, OnDestroy{
  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  workExperienceForm!: UntypedFormGroup;
  submitted = false;
  selectedFile: File | null = null;
  maxDate = new Date(); // today
  minEndDate?: Date;

  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.initForm();
    this.handleDateChanges();
  }

  private initForm(): void {
    this.workExperienceForm = this.fb.group({
      instituteName: [null, Validators.required],
      positionName: [null, Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
    });
  }

  get form() {
    return this.workExperienceForm.controls;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');
      event.target.value = ''; this.selectedFile = null;
      return;
    }
    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null;
      return;
    }
    this.selectedFile = file;
  }
  private handleDateChanges(): void {
    // START DATE CHANGE
    this.workExperienceForm.get('startDate')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((start: Date) => {
      if (!start) return;
      // set min end date = start date
      this.minEndDate = start;
      const end = this.workExperienceForm.get('endDate')?.value;
      // kama end < start → clear
      if (end && new Date(end) < new Date(start)) {
        this.workExperienceForm.patchValue({ endDate: null });
      }
    });

    // END DATE CHANGE
    this.workExperienceForm.get('endDate')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((end: Date) => {
      const start = this.workExperienceForm.get('startDate')?.value;
      if (!end || !start) return;
      // kama end < start → clear
      if (new Date(end) < new Date(start)) {
        this.workExperienceForm.patchValue({ endDate: null });
      }
    });
  }

  saveWorkExperience(): void {
    this.submitted = true;
    if (this.workExperienceForm.invalid) return;

    const formValue = this.workExperienceForm.value;
    const payload = {
      employer_name: this.form['instituteName'].value,
      experience_position: this.form['positionName'].value,
      start_date: this.datePipe.transform(formValue.startDate, 'yyyy-MM-dd'),
      end_date: this.datePipe.transform(formValue.endDate, 'yyyy-MM-dd'),
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
