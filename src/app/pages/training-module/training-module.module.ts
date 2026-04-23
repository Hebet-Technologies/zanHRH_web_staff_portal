import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { TrainingModuleRoutingModule } from './training-module-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTypeaheadModule, NgbTooltipModule, NgbDropdownModule, NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { SharedModule } from 'src/app/shared/shared.module';

import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import { EmployeeTrainingListComponent } from './employee-training-list/employee-training-list.component';
import { SortByTrainingPipe } from './sort-by.pipe';
// Ng Search 
import { NgPipesModule } from 'ngx-pipes';

// Simplebar
import { SimplebarAngularModule } from 'simplebar-angular';
import { EmployeeTrainingRequestFormComponent } from './employee-training-list/employee-training-request-form/employee-training-request-form.component';
import { StaffApplyAdvertisementComponent } from '../dashboards/staff-dashboard-blade/staff-apply-advertisement/staff-apply-advertisement.component';

@NgModule({
  declarations: [
    EmployeeTrainingListComponent,
    SortByTrainingPipe,
    EmployeeTrainingRequestFormComponent,
    StaffApplyAdvertisementComponent
  ],
  imports: [
    CommonModule,
    TrainingModuleRoutingModule,
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
export class TrainingModuleModule { 
   constructor() {
    defineElement(lottie.loadAnimation);
  }
}
