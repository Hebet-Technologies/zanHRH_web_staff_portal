import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-languages-form',
  templateUrl: './languages-form.component.html',
  styleUrl: './languages-form.component.scss'
})
export class LanguagesFormComponent implements OnInit, OnDestroy{
  @Input() languageList: any[] = [];
  
  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  languageForm!: UntypedFormGroup;
  submitted = false;

  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.languageForm = this.fb.group({
      languageID: [null, Validators.required],
      reading: [null, Validators.required],
      speaking: [null, Validators.required],
      writing: [null, Validators.required],
    });
  }

  get form() {
    return this.languageForm.controls;
  }

  saveLanguage(): void {
    this.submitted = true;
    if (this.languageForm.invalid) return;
    const payload = {
      language_id: this.form['languageID'].value,
      speaking: this.form['speaking'].value,
      reading: this.form['reading'].value,
      writting: this.form['writing'].value,
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
