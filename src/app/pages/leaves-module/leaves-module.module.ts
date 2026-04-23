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


@NgModule({
  declarations: [
    LeaveRequestEmployeeComponent,
    SortByLeavePipe,
    LeaveRequestEmployeeFormComponent,
    ReturnToLeaveRequestEmployeeFormComponent
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
    NgbNavModule
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
