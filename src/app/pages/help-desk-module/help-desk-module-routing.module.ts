import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpDeskTicketsComponent } from './tickets/help-desk-tickets.component';
import { HelpDeskTicketDetailComponent } from './ticket-detail/help-desk-ticket-detail.component';
import { HelpDeskCreateTicketComponent } from './ticket-create/help-desk-create-ticket.component';

const routes: Routes = [
  { path: '', redirectTo: 'tickets', pathMatch: 'full' },
  { path: 'tickets', component: HelpDeskTicketsComponent },
  { path: 'tickets/create', component: HelpDeskCreateTicketComponent },
  { path: 'tickets/:uuid', component: HelpDeskTicketDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpDeskModuleRoutingModule {}
