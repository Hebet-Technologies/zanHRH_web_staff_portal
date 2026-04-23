import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { RootReducerState } from 'src/app/store';
import { environment } from 'src/environments/environment';
import { selectProfileData, selectProfileLoading } from 'src/app/store/Profile_store/profile_selector';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { fetchPersonalDetail, updateProfile, updateProfileFailure } from 'src/app/store/Profile_store/profile_action';
import { UpdateProfilePayload } from 'src/app/store/Profile_store/profile_model';

@Component({
  selector: 'app-profile-edit-form',
  templateUrl: './profile-edit-form.component.html',
  styleUrl: './profile-edit-form.component.scss'
})
export class ProfileEditFormComponent implements OnInit,OnDestroy{
  employeeID: any;
  roleNames: any;
  fullName: any;
  isLoading = true;
  imageUrl = environment.imagePath;

  personalPhotoEdit!: UntypedFormGroup;
  profileData: any;
  
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
    this.fullName = user.fullName;
    this.roleNames = user.roleName;
    this.loadData()
    this.initForm();
  }

  private loadData(): void {
    this.store.dispatch(fetchPersonalDetail({ employeeID: this.employeeID }));
    
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    this.store.select(selectProfileData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      if (data) {
        this.profileData = data;
      }
    });
  }

  private initForm(): void {
    this.personalPhotoEdit = this.fb.group({
      photoFile: [null, Validators.required],
    });
  }

  imageURL: string | undefined;
  fileChange(event: any) {
    const fileList = event.target as HTMLInputElement;

    if (fileList.files && fileList.files.length > 0) {
      const file: File = fileList.files[0];

      this.personalPhotoEdit.patchValue({
        photoFile: file
      });

      // save automatically immediately after selecting image
      if (this.profileData) {
        const payload: UpdateProfilePayload = {
          personal_information_id: Number(this.profileData.personal_information_id),
          merital_status_id: Number(this.profileData.merital_status_id),
          phone_no: this.profileData.phone_no,
          physical_address: this.profileData.physical_address,
          location_id: Number(this.profileData.location_id),
          gender: this.profileData.gender,
          id_number: this.profileData.id_number,
          bank_id: Number(this.profileData.bank_id),
          bank_account_number: this.profileData.bank_account_number,
          identification_file: undefined,
          photo: file
        };

        // hakikisha field zote muhimu zipo
        const hasMissingField =
          payload.personal_information_id == null ||
          payload.merital_status_id == null ||
          !payload.phone_no ||
          !payload.physical_address ||
          payload.location_id == null ||
          !payload.gender ||
          !payload.id_number ||
          payload.bank_id == null ||
          !payload.bank_account_number;

        // ikiwa kuna field hata moja haipo
        if (hasMissingField) {
          this.store.dispatch(
            updateProfileFailure({
              error: 'Please complete all required profile information before uploading photo'
            })
          );
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            this.imageURL = reader.result as string;
            (document.getElementById('customer-img') as HTMLImageElement).src = this.imageURL;
          };
          reader.readAsDataURL(file);

          this.store.dispatch(updateProfile({ updatedData: payload }));
        }

      }
    }
  }

  activeTab = 1;
  onDetailTabChange(tabId: number) {
    this.activeTab = tabId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
