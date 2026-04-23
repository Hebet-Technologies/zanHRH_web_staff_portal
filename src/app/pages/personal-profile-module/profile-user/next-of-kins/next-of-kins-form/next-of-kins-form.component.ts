import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-next-of-kins-form',
  templateUrl: './next-of-kins-form.component.html',
  styleUrl: './next-of-kins-form.component.scss'
})
export class NextOfKinsFormComponent implements OnInit, OnDestroy{
  @Input() relationList: any[] = [];
  
  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  nextofKinsForm!: UntypedFormGroup;
  submitted = false;
  genderList = [
    { name: 'Male', value: 'Male' },
    { name: 'Female', value: 'Female' }
  ];

  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.nextofKinsForm = this.fb.group({
      firstName: [null, Validators.required],
      middleName: [null, Validators.required],
      lastName: [null, Validators.required],
      gender: [null, Validators.required],
      email: [null, [ Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNo: [null, [Validators.required,Validators.pattern(/^(\+255\d{9}|0\d{9})$/)]],
      relationID: [null, Validators.required],

    });
  }

  get form() {
    return this.nextofKinsForm.controls;
  }

  saveNextofKins(): void {
    this.submitted = true;
    if (this.nextofKinsForm.invalid) return;
    const payload = {
      first_name: this.form['firstName'].value,
      middle_name: this.form['middleName'].value,
      last_name: this.form['lastName'].value,
      phone_no: this.form['phoneNo'].value,
      email: this.form['email'].value,
      gender: this.form['gender'].value,
      relation_id: this.form['relationID'].value,
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
