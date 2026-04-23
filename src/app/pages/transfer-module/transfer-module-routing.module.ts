import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeTransferRequestComponent } from './employee-transfer-request/employee-transfer-request.component';

const routes: Routes = [
  {
    path: "employee-request-transfer",
    component: EmployeeTransferRequestComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferModuleRoutingModule { }
