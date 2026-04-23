import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-referee-form',
  templateUrl: './referee-form.component.html',
  styleUrl: './referee-form.component.scss'
})
export class RefereeFormComponent implements OnInit,OnDestroy{
  @Input() districtList: any[] = [];
  @Input() shehiaList: any[] = [];
  @Input() identityList: any[] = [];

   // receive function kutoka parent
  @Input() onDistrictChange!: (districtId: number) => void;
  
  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  refereesForm!: UntypedFormGroup;
  submitted = false;
  selectedFile: File | null = null;
  maxDate: Date;

  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder,  private datePipe: DatePipe) {
    const today = new Date();
    this.maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.refereesForm = this.fb.group({
      firstName: [null, Validators.required],
      middleName: [null, Validators.required],
      lastName: [null, Validators.required],
      email: [null, [ Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phoneNo: [null, [Validators.required,Validators.pattern(/^(\+255\d{9}|0\d{9})$/)]],
      dob: [null, Validators.required],
      districtID: [null, Validators.required],
      shehiaID: [null, Validators.required],
      identityID: [null, Validators.required],
      identificationNumber: [null, Validators.required],
      workingArea: [null, Validators.required],
      position: [null, Validators.required],
      passportSize: [null, Validators.required]

    });
  }

  get form() {
    return this.refereesForm.controls;
  }

  onDistrictDataChange(event: any) {
    const districtId = event?.district_id;
    // reset program
    this.refereesForm.patchValue({ shehiaID: null });
    if (!districtId) {
      this.shehiaList = []; // clear UI
      return;
    }
    // call parent function
    if (this.onDistrictChange) {
      this.onDistrictChange(districtId);
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // allowed image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire('Error', 'Only JPG, JPEG and PNG images are allowed', 'error');
      event.target.value = '';
      this.selectedFile = null;
      this.refereesForm.get('passportSize')?.setValue(null);
      return;
    }

    // max size 1MB
    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = '';
      this.selectedFile = null;
      this.refereesForm.get('passportSize')?.setValue(null);
      return;
    }

    this.selectedFile = file;
    this.form['passportSize'].setValue(file);
  }

  saveReferee(): void {
    this.submitted = true;
    if (this.refereesForm.invalid) return;

    const payload = {
      first_name: this.form['firstName'].value,
      middle_name: this.form['middleName'].value,
      last_name: this.form['lastName'].value,
      refferee_phone: this.form['phoneNo'].value,
      refferee_position: this.form['position'].value,
      working_area: this.form['workingArea'].value,
      email: this.form['email'].value,
      date_of_birth: this.datePipe.transform(this.form['dob'].value, 'yyyy-MM-dd'),
      location_id: this.form['shehiaID'].value,
      identification_id: this.form['identityID'].value,
      id_number: this.form['identificationNumber'].value,
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
