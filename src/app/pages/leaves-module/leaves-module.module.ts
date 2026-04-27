import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { LeavesModuleRoutingModule } from './leaves-module-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbDropdownModule, NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { LeaveRequestEmployeeComponent } from './leave-request-employee/leave-request-employee.component';
import { SortByLeavePipe } from './sort-by.pipe';

// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';
import { LeaveRequestEmployeeFormComponent } from './leave-request-employee/leave-request-employee-form/leave-request-employee-form.component';
import { ReturnToLeaveRequestEmployeeFormComponent } from './leave-request-employee/return-to-leave-request-employee-form/return-to-leave-request-employee-form.component';
import { StaffOnLeaveComponent } from './views-staff-leave-status/staff-on-leave/staff-on-leave.component';
import { StaffWaitingForLeaveComponent } from './views-staff-leave-status/staff-waiting-for-leave/staff-waiting-for-leave.component';
import { StaffOverdueLeaveComponent } from './views-staff-leave-status/staff-overdue-leave/staff-overdue-leave.component';
import { StaffLeaveRequestStageComponent } from './staff-leave-request-stage/staff-leave-request-stage.component';
import { NgPipesModule } from 'ngx-pipes';
import { SimplebarAngularModule } from 'simplebar-angular';
import { StaffDeniedLeaveRequestComponent } from './views-staff-leave-status/staff-denied-leave-request/staff-denied-leave-request.component';
import { ManageStaffBackWorkComponent } from './manage-staff-back-work/manage-staff-back-work.component';
import { StaffBackToWorkFormComponent } from './manage-staff-back-work/staff-back-to-work-form/staff-back-to-work-form.component';


@NgModule({
  declarations: [
    LeaveRequestEmployeeComponent,
    SortByLeavePipe,
    LeaveRequestEmployeeFormComponent,
    ReturnToLeaveRequestEmployeeFormComponent,
    StaffOnLeaveComponent,
    StaffWaitingForLeaveComponent,
    StaffOverdueLeaveComponent,
    StaffLeaveRequestStageComponent,
    StaffDeniedLeaveRequestComponent,
    ManageStaffBackWorkComponent,
    StaffBackToWorkFormComponent
  ],
  imports: [
    CommonModule,
    LeavesModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    FlatpickrModule,
    NgSelectModule,
    SharedModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgPipesModule
  ],
  providers: [
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class LeavesModuleModule { 
   constructor() {
    defineElement(lottie.loadAnimation);
  }
}
