import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { loadAdvertPositions, loadAdvertProgram } from 'src/app/store/Dashboard_store/dashboard_action';
import { selectAdvertPositionsIDData, selectAdvertProgramIDData } from 'src/app/store/Dashboard_store/dashboard_selector';
import { RootReducerState } from 'src/app/store';
import { Store } from '@ngrx/store';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-staff-apply-advertisement',
  templateUrl: './staff-apply-advertisement.component.html',
  styleUrl: './staff-apply-advertisement.component.scss'
})
export class StaffApplyAdvertisementComponent implements OnInit, OnDestroy{
  @Input() rowSelected: any;

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  staffJobRequestForm!: UntypedFormGroup;
  submitted = false;

  private destroy$ = new Subject<void>();

  selectedFile: File | null = null;
  advertPositionsList: any[] = [];
  advertProgramList: any[] = [];
  showWorkFields = false;
  statusList = [
    { name: 'Active', value: '0' },
    { name: 'Leave without pay', value: '1' }
  ];



  constructor(
    private fb: UntypedFormBuilder,
    private store: Store<{ data: RootReducerState }>, 
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.loadStaffData();
    this.handleStatusChanges();

  }

  private initForm(): void {
    this.staffJobRequestForm = this.fb.group({
      advertPositionsID: [null, Validators.required],
      advertProgramID: [null, Validators.required],
      uploadApplicationLater: [null, Validators.required],
      currentStatus: [null, Validators.required],
      curentWorkingStation: [null],
      workingPosition: [null],

    });
  }

  get form() {
    return this.staffJobRequestForm.controls;
  }

  private loadStaffData(): void {
    this.store.dispatch(loadAdvertPositions({staffAdvertisementID: this.rowSelected.staff_advertisement_id}));
    this.store.select(selectAdvertPositionsIDData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.advertPositionsList = data;
    });
    this.store.dispatch(loadAdvertProgram({staffAdvertisementID: this.rowSelected.staff_advertisement_id}));
    this.store.select(selectAdvertProgramIDData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.advertProgramList = data;
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');
      event.target.value = ''; this.selectedFile = null; this.staffJobRequestForm.get('uploadApplicationLater')?.setValue(null);
      return;
    }
    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null; this.staffJobRequestForm.get('uploadApplicationLater')?.setValue(null);
      return;
    }
    this.selectedFile = file;
    this.form['uploadApplicationLater'].setValue(file);
  }

  private handleStatusChanges(): void {

    this.staffJobRequestForm.get('currentStatus')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {

        if (status === '1') {
          // SHOW fields
          this.showWorkFields = true;

          this.form['curentWorkingStation'].setValidators([Validators.required]);
          this.form['workingPosition'].setValidators([Validators.required]);

        } else {
          // HIDE fields
          this.showWorkFields = false;

          this.form['curentWorkingStation'].clearValidators();
          this.form['curentWorkingStation'].setValue(null);

          this.form['workingPosition'].clearValidators();
          this.form['workingPosition'].setValue(null);
        }

        this.form['curentWorkingStation'].updateValueAndValidity();
        this.form['workingPosition'].updateValueAndValidity();
      });
  }

  saveApplyAdvertisementForm(): void {
    this.submitted = true;
    if (this.staffJobRequestForm.invalid) return;

    const formValue = this.staffJobRequestForm.value;
    const payload = {
      staff_advertisement_id: this.rowSelected.staff_advertisement_id,
      staff_adver_position_id: formValue.advertPositionsID,
      program_id: formValue.advertProgramID,
      upload_file_name: this.selectedFile || undefined,

      ...(formValue.currentStatus === '1' && {
        working_area: formValue.curentWorkingStation,
        working_position: formValue.workingPosition
      })

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
