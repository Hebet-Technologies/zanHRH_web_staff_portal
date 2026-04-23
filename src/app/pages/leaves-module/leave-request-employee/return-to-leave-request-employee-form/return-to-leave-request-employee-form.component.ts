import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-return-to-leave-request-employee-form',
  templateUrl: './return-to-leave-request-employee-form.component.html',
  styleUrl: './return-to-leave-request-employee-form.component.scss'
})
export class ReturnToLeaveRequestEmployeeFormComponent implements OnInit, OnDestroy{

  @Input() endDate!: string;

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  returnToleaveRequestForm!: UntypedFormGroup;
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
    this.minDate = new Date(this.endDate); // 👈 kutoka API
    this.maxDate = new Date(); // 👈 today

  }

  private initForm(): void {
    this.returnToleaveRequestForm = this.fb.group({
      description: [null, Validators.required],
      returnedDate: [null, Validators.required],
    });
  }

  get form() {
    return this.returnToleaveRequestForm.controls;
  }

  saveLeaveReturnToWork(): void {
    this.submitted = true;
    if (this.returnToleaveRequestForm.invalid) return;

    const formValue = this.returnToleaveRequestForm.value;
    const payload = {
      description: formValue.description,
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
