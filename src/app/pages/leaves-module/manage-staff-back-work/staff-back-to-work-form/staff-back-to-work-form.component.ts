import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-staff-back-to-work-form',
  templateUrl: './staff-back-to-work-form.component.html',
  styleUrl: './staff-back-to-work-form.component.scss'
})
export class StaffBackToWorkFormComponent implements OnInit, OnDestroy {
  @Input() rowdataSelected!: any;

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  confirmReturnToleaveRequestForm!: UntypedFormGroup;
  submitted = false;

  private destroy$ = new Subject<void>();
  minDate!: Date;
  maxDate!: Date;

  constructor(
    private fb: UntypedFormBuilder,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.maxDate = new Date(); // 👈 today
  }

  private initForm(): void {
    this.confirmReturnToleaveRequestForm = this.fb.group({
      description: [null, Validators.required],
      returnedDate: [null, Validators.required],
    });
  }

  get form() {
    return this.confirmReturnToleaveRequestForm.controls;
  }

  saveConfirmLeaveReturnToWork(): void {
    this.submitted = true;
    if (this.confirmReturnToleaveRequestForm.invalid) return;

    const formValue = this.confirmReturnToleaveRequestForm.value;
    const payload = {
      comment: formValue.description,
      returned_date: this.datePipe.transform(formValue.returnedDate, 'yyyy-MM-dd'),
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
