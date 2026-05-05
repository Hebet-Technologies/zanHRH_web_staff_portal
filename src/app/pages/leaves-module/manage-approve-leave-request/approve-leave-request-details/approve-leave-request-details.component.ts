import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { RootReducerState } from 'src/app/store';
import { selectSelectedLeaveRequest } from 'src/app/store/Leave_store/leave_selector';
import { fetchPersonalDetail } from 'src/app/store/Profile_store/profile_action';
import { selectProfileData } from 'src/app/store/Profile_store/profile_selector';

@Component({
  selector: 'app-approve-leave-request-details',
  templateUrl: './approve-leave-request-details.component.html',
  styleUrl: './approve-leave-request-details.component.scss'
})
export class ApproveLeaveRequestDetailsComponent implements OnInit,OnDestroy{
  profileData: any;
  employeeID: any;
  roleNames: any;
  isLoading = true;
  imageUrl = environment.imagePath;
  approveLeaveDetails: any = null;

  // For unsubscribing
  private destroy$ = new Subject<void>();

  constructor(
    private modalService: NgbModal, 
    private actions$: Actions,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>, 
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.employeeID = user.personalInformationID;
    this.roleNames = user.roleName;

    this.store.select(selectSelectedLeaveRequest).subscribe(res => {
      this.approveLeaveDetails = res;
    });
    // console.log('Selected Leave Request Details:', this.approveLeaveDetails);

    this.loadData();
  }

  private loadData(): void {
    this.store.dispatch(fetchPersonalDetail({ employeeID: this.approveLeaveDetails.personal_information_id }));
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
