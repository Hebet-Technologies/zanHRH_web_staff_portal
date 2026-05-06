import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-education-employee-form',
  templateUrl: './education-employee-form.component.html',
  styleUrl: './education-employee-form.component.scss'
})
export class EducationEmployeeFormComponent implements OnInit, OnDestroy{
  @Input() educationLevel: any[] = [];
  @Input() programs: any[] = [];
  @Input() instituteCountry: any[] = [];
  @Input() institutes: any[] = [];

  
  // receive function kutoka parent
  @Input() onLevelChange!: (levelId: number) => void;
  @Input() onCountryChange!: (countryId: number) => void;
  
  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  educationForm!: UntypedFormGroup;
  submitted = false;
  startYears: any[] = [];
  endYears: any[] = [];
  currentYear = new Date().getFullYear();

  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.handleCountryChange();

    this.generateYearRange();
    this.handleYearChanges();
  }

  private initForm(): void {
    this.educationForm = this.fb.group({
      educationLevelID: [null, Validators.required],
      programID: [null, Validators.required],
      countryID: [null, Validators.required],
      instituteID: [null, Validators.required],
      from_year: [null, Validators.required],
      to_year: [null, Validators.required],
      gpa: [null],

    });
  }

  get form() {
    return this.educationForm.controls;
  }

  onEducationChange(event: any) {
    const levelId = event?.education_level_id;
    // reset program
    this.educationForm.patchValue({ programID: null,instituteID: null });
    if (!levelId) {
      this.programs = []; // clear UI
      return;
    }
    // call parent function
    if (this.onLevelChange) {
      this.onLevelChange(levelId);
    }
  }
  // Country ValueChanges (HII NDIO ULIYOULIZA)
  private handleCountryChange(): void {
    this.educationForm.get('countryID')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((countryId: number) => {
      // reset institute
      this.educationForm.patchValue({instituteID: null});
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
  private generateYearRange() {
    this.startYears = [];
    this.endYears = [];
    for (let year = 1960; year <= this.currentYear; year++) {
      const y = { id: year.toString(), name: year.toString() };
      this.startYears.push(y);
      this.endYears.push(y);
    }
  }
  private handleYearChanges() {
    this.educationForm.get('from_year')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((selectedYear: string) => {
      this.endYears = [];
      if (selectedYear) {
        for (let year = Number(selectedYear) + 1; year <= this.currentYear; year++) {
          this.endYears.push({
            id: year.toString(),
            name: year.toString()
          });
        }
      }

      // reset to_year kama haipo kwenye range mpya
      const currentEndYear = this.educationForm.get('to_year')?.value;
      const exists = this.endYears.some(y => y.id === currentEndYear);
      if (currentEndYear && !exists) {
        this.educationForm.patchValue({ to_year: null });
      }
    });
  }

  saveEducation(): void {
    this.submitted = true;
    if (this.educationForm.invalid) return;
    const payload = {
      education_level_id: this.form['educationLevelID'].value,
      institute_id: this.form['instituteID'].value,
      country_id: this.form['countryID'].value,
      program_id: this.form['programID'].value,
      from_year: this.form['from_year'].value,
      to_year: this.form['to_year'].value,
      gpa: this.form['gpa'].value
      ? Number(this.form['gpa'].value)
      : null,
    };
    // console.log('all data submited',payload)
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
