import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-hobbies-or-interests-form',
  templateUrl: './hobbies-or-interests-form.component.html',
  styleUrl: './hobbies-or-interests-form.component.scss'
})
export class HobbiesOrInterestsFormComponent implements OnInit, OnDestroy{
  @Input() hobbyList: any[] = [];

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  hobbiesForm!: UntypedFormGroup;
  submitted = false;

  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.hobbiesForm = this.fb.group({
      hobbyID: [null, Validators.required],
    });
  }

  get form() {
    return this.hobbiesForm.controls;
  }

  saveHobbies(): void {
    this.submitted = true;
    if (this.hobbiesForm.invalid) return;
    const payload = {
      hobby_id: this.form['hobbyID'].value,
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
