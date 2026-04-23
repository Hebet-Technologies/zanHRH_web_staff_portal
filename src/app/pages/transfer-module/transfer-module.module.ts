import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferModuleRoutingModule } from './transfer-module-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeTransferRequestComponent } from './employee-transfer-request/employee-transfer-request.component';
import { SortByTransferPipe } from './sort-by.pipe';

// Load Icons
import { defineElement } from '@lordicon/element';
import lottie from 'lottie-web';
import { EmployeeTransferRequestFormComponent } from './employee-transfer-request/employee-transfer-request-form/employee-transfer-request-form.component';
import { EducationEmployeeFormComponent } from '../personal-profile-module/profile-user/education-profile/education-employee-form/education-employee-form.component';
import { WorkExperienceProfileFormComponent } from '../personal-profile-module/profile-user/work-experience-profile/work-experience-profile-form/work-experience-profile-form.component';


@NgModule({
  declarations: [
    EmployeeTransferRequestComponent,
    EmployeeTransferRequestFormComponent,
    SortByTransferPipe,
    EducationEmployeeFormComponent,
    WorkExperienceProfileFormComponent
  ],
  imports: [
    CommonModule,
    TransferModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbTooltipModule,
    NgbDropdownModule,
    NgbAccordionModule,
    FlatpickrModule,
    NgSelectModule,
    SharedModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransferModuleModule {
  constructor() {
    defineElement(lottie.loadAnimation);
  }
 }
