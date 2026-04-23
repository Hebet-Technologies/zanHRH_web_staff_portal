import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTrainingListComponent } from './employee-training-list/employee-training-list.component';

const routes: Routes = [
   {
      path: "employee-training-lists",
      component: EmployeeTrainingListComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingModuleRoutingModule { }
