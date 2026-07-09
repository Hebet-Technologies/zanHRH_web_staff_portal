import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

import { HelpDeskModuleRoutingModule } from './help-desk-module-routing.module';
import { HelpDeskTicketsComponent } from './tickets/help-desk-tickets.component';
import { HelpDeskTicketDetailComponent } from './ticket-detail/help-desk-ticket-detail.component';
import { HelpDeskCreateTicketComponent } from './ticket-create/help-desk-create-ticket.component';
import { HelpDeskMyRequestsComponent } from './my-requests/help-desk-my-requests.component';

@NgModule({
  declarations: [
    HelpDeskTicketsComponent,
    HelpDeskTicketDetailComponent,
    HelpDeskCreateTicketComponent,
    HelpDeskMyRequestsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HelpDeskModuleRoutingModule,
    NgbPaginationModule,
    NgbTooltipModule,
    NgbDropdownModule,
    SharedModule,
  ],
})
export class HelpDeskModuleModule {}
