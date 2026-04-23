import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { RootReducerState } from 'src/app/store';
import { addAttachmentFailure, addAttachmentSuccess, deleteAttachment, deleteAttachmentFailure, deleteAttachmentSuccess, fetchAttachmentsData, fetchEducationData, fetchPersonalDetail, fetchWorkExperienceData } from 'src/app/store/Profile_store/profile_action';
import { selectProfileLoading, selectProfileData, selectEducationData, selectWorkExperienceData, selectAttachmentsData } from 'src/app/store/Profile_store/profile_selector';
import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/app/core/services/pagination.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrl: './profile-user.component.scss'
})
export class ProfileUserComponent implements OnInit,OnDestroy{
  profileData: any;
  employeeID: any;
  roleNames: any;
  isLoading = true;
  imageUrl = environment.imagePath;

  // For unsubscribing
  private destroy$ = new Subject<void>();

  constructor(
    private modalService: NgbModal, 
    private actions$: Actions,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>, 
    public service: PaginationService,
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.employeeID = user.personalInformationID;
    this.roleNames = user.roleName;

    this.loadData();
  }

  private loadData(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });
    //personal info
    this.store.dispatch(fetchPersonalDetail({ employeeID: this.employeeID }));
    this.store.select(selectProfileData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {this.profileData = data || []});

  }

  activeTab = 1;
  onDetailTabChange(tabId: number) {
    this.activeTab = tabId;
  }

  activeTabMenu = 1;
  onDetailTabChangeMenu(tabId: number) {
    this.activeTabMenu = tabId;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
