import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PsDashboardBladeComponent } from './ps-dashboard-blade/ps-dashboard-blade.component';
import { StaffDashboardBladeComponent } from './staff-dashboard-blade/staff-dashboard-blade.component';

const routes: Routes = [
  {
    path: "ps-dashboard-views",
    component: PsDashboardBladeComponent
  },
  {
    path: "staff-dashboard-views",
    component: StaffDashboardBladeComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DashboardsRoutingModule { }
