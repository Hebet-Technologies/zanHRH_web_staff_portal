import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalProfileModuleRoutingModule } from './personal-profile-module-routing.module';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbDropdownModule, NgbAccordionModule, NgbTooltipModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FeatherModule } from 'angular-feather';
import { allIcons } from 'angular-feather/icons';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgPipesModule } from 'ngx-pipes';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { SharedModule } from 'src/app/shared/shared.module';
import { SortByProfilePipe } from './sort-by.pipe';
import { defineElement } from '@lordicon/element';

import lottie from 'lottie-web';
import { EducationProfileComponent } from './profile-user/education-profile/education-profile.component';
import { WorkExperienceProfileComponent } from './profile-user/work-experience-profile/work-experience-profile.component';
import { HobbiesOrInterestsComponent } from './profile-user/hobbies-or-interests/hobbies-or-interests.component';
import { HobbiesOrInterestsFormComponent } from './profile-user/hobbies-or-interests/hobbies-or-interests-form/hobbies-or-interests-form.component';
import { SkillsComponent } from './profile-user/skills/skills.component';
import { SkillsFormComponent } from './profile-user/skills/skills-form/skills-form.component';
import { LanguagesComponent } from './profile-user/languages/languages.component';
import { LanguagesFormComponent } from './profile-user/languages/languages-form/languages-form.component';
import { NextOfKinsComponent } from "./profile-user/next-of-kins/next-of-kins.component";
import { NextOfKinsFormComponent } from './profile-user/next-of-kins/next-of-kins-form/next-of-kins-form.component';
import { RefereesComponent } from './profile-user/referees/referees.component';
import { RefereeFormComponent } from './profile-user/referees/referee-form/referee-form.component';
import { EmployeeAttachmentsComponent } from './profile-user/employee-attachments/employee-attachments.component';
import { EmployeeAttachmentsFormComponent } from './profile-user/employee-attachments/employee-attachments-form/employee-attachments-form.component';
import { ProfileEditFormComponent } from './profile-edit-form/profile-edit-form.component';
import { PersonalDetailFormComponent } from './profile-edit-form/personal-detail-form/personal-detail-form.component';
import { PersonalChangePasswordComponent } from './profile-edit-form/personal-change-password/personal-change-password.component';
import { PersonalPrivacyPolicyComponent } from './profile-edit-form/personal-privacy-policy/personal-privacy-policy.component';


@NgModule({
  declarations: [
    ProfileUserComponent,
    SortByProfilePipe,
    EducationProfileComponent,
    WorkExperienceProfileComponent,
    HobbiesOrInterestsComponent,
    HobbiesOrInterestsFormComponent,
    SkillsComponent,
    SkillsFormComponent,
    LanguagesComponent,
    LanguagesFormComponent,
    NextOfKinsComponent,
    NextOfKinsFormComponent,
    RefereesComponent,
    RefereeFormComponent,
    EmployeeAttachmentsComponent,
    EmployeeAttachmentsFormComponent,
    ProfileEditFormComponent,
    PersonalDetailFormComponent,
    PersonalChangePasswordComponent,
    PersonalPrivacyPolicyComponent
  ],
  imports: [
    CommonModule,
    PersonalProfileModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
],

    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  
})
export class PersonalProfileModuleModule { 
  constructor() {
    defineElement(lottie.loadAnimation);
  }
}
