import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { RootReducerState } from 'src/app/store';
import { loadMaritalStatus, loadShehiaProfile, loadBankName, fetchPersonalDetail, updateProfile, updateProfileFailure, updateProfileSuccess } from 'src/app/store/Profile_store/profile_action';
import { selectProfileLoading, selectMaritalStatus, selectShehiaProfile, selectBankName, selectProfileData } from 'src/app/store/Profile_store/profile_selector';
import { environment } from 'src/environments/environment';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UpdateProfilePayload } from 'src/app/store/Profile_store/profile_model';

@Component({
  selector: 'app-personal-detail-form',
  templateUrl: './personal-detail-form.component.html',
  styleUrl: './personal-detail-form.component.scss'
})
export class PersonalDetailFormComponent {
  employeeID: any;
  roleNames: any;
  isLoading = true;
  imageUrl = environment.imagePath;
  profileData: any;

  //edit data
  maritalStatusList: any[] = [];
  shehiaProfileList: any[] = [];
  bankNameList: any[] = [];

  personalEditForm!: UntypedFormGroup;
  submitted = false;
  genderList = [
    { name: 'Male', value: 'Male' },
    { name: 'Female', value: 'Female' }
  ];

  selectedFile: File | null = null;

  // For unsubscribing
  private destroy$ = new Subject<void>();

  constructor(
    private modalService: NgbModal, 
    private actions$: Actions,
    private fb: UntypedFormBuilder,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>, 
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.employeeID = user.personalInformationID;
    this.roleNames = user.roleName;

    this.initForm();
    this.loadData();
    this.loadProfileData();
    this.listenAllPersonalProfileActions();

  }

  private loadData(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });
    //marital status info
    this.store.dispatch(loadMaritalStatus());
    this.store.select(selectMaritalStatus)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.maritalStatusList = data || []);
    //shehia info
    this.store.dispatch(loadShehiaProfile());
    this.store.select(selectShehiaProfile)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.shehiaProfileList = data || []);
    //bank info
    this.store.dispatch(loadBankName());
    this.store.select(selectBankName)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.bankNameList = data || []);
  }

  private initForm(): void {
    this.personalEditForm = this.fb.group({
      phoneNo: [null, [Validators.required,Validators.pattern(/^(\+255\d{9}|0\d{9})$/)]],
      gender: [null, Validators.required],
      meritalStatusID: [null, Validators.required],
      shehiaID: [null, Validators.required],
      physicalAddress: [null, Validators.required],
      zanID: [null, Validators.required],
      zanIdFILE: [null, Validators.required],
      bankNameID: [null, Validators.required],
      bankAccount: [null, Validators.required]
    });
  }

  get form() {
    return this.personalEditForm.controls;
  }

  private loadProfileData(): void {
  this.store.dispatch(fetchPersonalDetail({ employeeID: this.employeeID }));

  this.store.select(selectProfileData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if (data) {
        this.profileData = data;

        this.personalEditForm.patchValue({
          phoneNo: this.profileData.phone_no,
          gender: this.profileData.gender,
          meritalStatusID: this.profileData.merital_status_id,
          shehiaID: this.profileData.location_id,
          physicalAddress: this.profileData.physical_address,
          zanID: this.profileData.id_number,
          bankNameID: this.profileData.bank_id,
          bankAccount: this.profileData.bank_account_number
        });
      }
    });
}


  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');
      event.target.value = ''; this.selectedFile = null; this.personalEditForm.get('zanIdFILE')?.setValue(null);
      return;
    }
    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null; this.personalEditForm.get('zanIdFILE')?.setValue(null);
      return;
    }
    this.selectedFile = file;
    this.form['zanIdFILE'].setValue(file);
  }

  savePersonalProfile(): void {
    this.submitted = true;
    if (this.personalEditForm.invalid) return;

    const payload: UpdateProfilePayload = {
      personal_information_id: this.employeeID,
      merital_status_id: this.form['meritalStatusID'].value,
      phone_no: this.form['phoneNo'].value,
      physical_address: this.form['physicalAddress'].value,
      location_id: this.form['shehiaID'].value,
      gender: this.form['gender'].value,
      bank_account_number: this.form['bankAccount'].value,
      id_number: this.form['zanID'].value,
      bank_id: this.form['bankNameID'].value,

      identification_file: this.selectedFile || undefined
    };

    this.store.dispatch(updateProfile({ updatedData: payload }));
  }

  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    //ADD transfer
    [updateProfileSuccess.type]: {icon: 'success',title: 'Personal Profile Updated',closeModal: true,timer: 2000},
    [updateProfileFailure.type]: {icon: 'error',title: 'Personal Profile Updated failed'},
  };
  private listenAllPersonalProfileActions(): void {
    this.actions$.pipe(
      ofType(
        updateProfileSuccess,updateProfileFailure
      ),
      takeUntil(this.destroy$)
    ).subscribe((action: any) => {
      const config = this.actionMessages[action.type];
      if (!config) return;
      Swal.fire({
        icon: config.icon,
        title: config.title,
        text: action.error || '',
        timer: config.timer || undefined
      });
      //close modal only if needed
      if (config.closeModal) {
        this.modalService.dismissAll();
      }
    });
  }
  //ujumbe unaokuja ndio huu hapa end

  openAttachment(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
