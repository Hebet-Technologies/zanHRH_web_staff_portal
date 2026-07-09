import { Component, OnInit } from '@angular/core';
import { HelpDeskService } from 'src/app/core/services/help-desk-card/help-desk.service';

@Component({
  selector: 'app-help-desk-my-requests',
  templateUrl: './help-desk-my-requests.component.html',
  styleUrls: ['./help-desk-my-requests.component.scss'],
})
export class HelpDeskMyRequestsComponent implements OnInit {
  isLoading = true;
  errorMessage = '';
  tickets: any[] = [];
  search = '';
  status = '';

  readonly statuses = [
    { value: '', label: 'All' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  constructor(private helpDesk: HelpDeskService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.helpDesk.getMyTickets({ status: this.status, search: this.search }).subscribe({
      next: (res) => {
        this.tickets = res?.tickets ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Could not load tickets.';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.loadTickets();
  }

  resetFilters(): void {
    this.status = '';
    this.search = '';
    this.loadTickets();
  }

  statusClass(status: string): string {
    switch (status) {
      case 'OPEN': return 'badge bg-primary-subtle text-primary';
      case 'IN_PROGRESS': return 'badge bg-warning-subtle text-warning';
      case 'PENDING': return 'badge bg-info-subtle text-info';
      case 'RESOLVED': return 'badge bg-success-subtle text-success';
      case 'CLOSED': return 'badge bg-secondary-subtle text-secondary';
      default: return 'badge bg-light text-muted';
    }
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'URGENT': return 'badge bg-danger-subtle text-danger';
      case 'HIGH': return 'badge bg-warning-subtle text-warning';
      case 'LOW': return 'badge bg-light text-muted';
      default: return 'badge bg-primary-subtle text-primary';
    }
  }
}
