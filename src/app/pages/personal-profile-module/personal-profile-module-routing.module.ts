import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileUserComponent } from './profile-user/profile-user.component';
import { ProfileEditFormComponent } from './profile-edit-form/profile-edit-form.component';

const routes: Routes = [
  {
    path: "personal-profile",
    component: ProfileUserComponent
  },
  {
    path: "personal-profile-form",
    component: ProfileEditFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalProfileModuleRoutingModule { }
