import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveRequestEmployeeComponent } from './leave-request-employee/leave-request-employee.component';
import { StaffOnLeaveComponent } from './views-staff-leave-status/staff-on-leave/staff-on-leave.component';
import { StaffWaitingForLeaveComponent } from './views-staff-leave-status/staff-waiting-for-leave/staff-waiting-for-leave.component';
import { StaffOverdueLeaveComponent } from './views-staff-leave-status/staff-overdue-leave/staff-overdue-leave.component';
import { StaffLeaveRequestStageComponent } from './staff-leave-request-stage/staff-leave-request-stage.component';
import { StaffDeniedLeaveRequestComponent } from './views-staff-leave-status/staff-denied-leave-request/staff-denied-leave-request.component';
import { ManageStaffBackWorkComponent } from './manage-staff-back-work/manage-staff-back-work.component';
import { ManageApproveLeaveRequestComponent } from './manage-approve-leave-request/manage-approve-leave-request.component';
import { ApproveLeaveRequestDetailsComponent } from './manage-approve-leave-request/approve-leave-request-details/approve-leave-request-details.component';

const routes: Routes = [
  {
    path: "employee-leaves-request",
    component: LeaveRequestEmployeeComponent
  },
  {
    path: "staff-on-leave",
    component: StaffOnLeaveComponent
  },
  {
    path: "staff-waiting-for-leave",
    component: StaffWaitingForLeaveComponent
  },
  {
    path: "staff-overdue-leave",
    component: StaffOverdueLeaveComponent
  },
  {
    path: "staff-leave-request-stage",
    component: StaffLeaveRequestStageComponent
  },
  {
    path: "staff-denied-leave-request",
    component: StaffDeniedLeaveRequestComponent
  },
  {
    path: "staff-back-to-work",
    component: ManageStaffBackWorkComponent
  },
  {
    path: "manage-approve-leave-request",
    component: ManageApproveLeaveRequestComponent
  },
  {
    path: "approve-leave-request-details",
    component: ApproveLeaveRequestDetailsComponent
  }


  
  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesModuleRoutingModule { }
