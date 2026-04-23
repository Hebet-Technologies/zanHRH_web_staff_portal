import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgbAccordionModule,
  NgbToastModule
} from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule, NgbTypeaheadModule, NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Feather Icon
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { CountUpModule } from 'ngx-countup';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { SimplebarAngularModule } from 'simplebar-angular';
// Apex Chart Package
import { NgApexchartsModule } from 'ng-apexcharts';
// Swiper Slider
import { SlickCarouselModule } from 'ngx-slick-carousel';

// Flat Picker
import { FlatpickrModule } from 'angularx-flatpickr';


//Module
import { DashboardsRoutingModule } from "./dashboards-routing.module";
import { SharedModule } from '../../shared/shared.module';
import { WidgetModule } from '../../shared/widget/widget.module';
import { StaffDashboardBladeComponent } from './staff-dashboard-blade/staff-dashboard-blade.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgPipesModule } from 'ngx-pipes';

import lottie from 'lottie-web';
import { defineElement } from '@lordicon/element';
import { StaffApplyAdvertDetailComponent } from './staff-dashboard-blade/staff-apply-advert-detail/staff-apply-advert-detail.component';

@NgModule({
  declarations: [
    StaffDashboardBladeComponent,
    StaffApplyAdvertDetailComponent,


  ],
  imports: [
    CommonModule,
    NgbToastModule,
    FeatherModule.pick(allIcons),
    CountUpModule,
    LeafletModule,
    NgbDropdownModule,
    NgbNavModule,
    SimplebarAngularModule,
    NgApexchartsModule,
    SlickCarouselModule,
    FlatpickrModule.forRoot(),
    DashboardsRoutingModule,
    SharedModule,
    WidgetModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgSelectModule,
    NgPipesModule
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardsModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
