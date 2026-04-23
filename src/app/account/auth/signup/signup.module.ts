import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponent } from './basic/basic.component';

import { NgbAccordionModule, NgbCarouselModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Component
import { SigninRoutingModule } from './signup-routing.module';
import { CoverComponent } from './cover/cover.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgPipesModule } from 'ngx-pipes';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PersonalProfileModuleRoutingModule } from 'src/app/pages/personal-profile-module/personal-profile-module-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    BasicComponent,
    CoverComponent
  ],
  imports: [
    CommonModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    FormsModule,
    SigninRoutingModule,
    PersonalProfileModuleRoutingModule,
    NgbNavModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbTooltipModule,
    NgbPaginationModule,
    SlickCarouselModule,
    NgSelectModule,
    FlatpickrModule,
    SharedModule,
    FeatherModule.pick(allIcons),
    NgPipesModule,
    NgbTypeaheadModule,
  ]
})
export class SignupModule { }
