import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveRequestEmployeeComponent } from './leave-request-employee/leave-request-employee.component';

const routes: Routes = [
  {
    path: "employee-leaves-request",
    component: LeaveRequestEmployeeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesModuleRoutingModule { }
