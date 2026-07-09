import { Component, OnInit } from '@angular/core';
import { HelpDeskService } from 'src/app/core/services/help-desk-card/help-desk.service';

@Component({
  selector: 'app-help-desk-tickets',
  templateUrl: './help-desk-tickets.component.html',
  styleUrl: './help-desk-tickets.component.scss',
})
export class HelpDeskTicketsComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  isLoading = true;
  errorMessage = '';
  activeTab = 'all';

  stats: any = {
    total: 0,
    open: 0,
    closed: 0,
    unassigned: 0,
    public: 0,
    by_status: {},
    by_priority: {},
  };

  tickets: any[] = [];
  categories: any[] = [];

  // Filters
  scope = 'all';
  status = '';
  priority = '';
  categoryUuid = '';
  search = '';

  readonly scopes = [
    { value: 'all', label: 'All tickets' },
    { value: 'assigned', label: 'Assigned to me' },
    { value: 'unassigned', label: 'Unassigned' },
    { value: 'mine', label: 'Raised by me' },
  ];

  readonly statuses = [
    { value: '', label: 'Any status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In progress' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  readonly priorities = [
    { value: '', label: 'Any priority' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'HIGH', label: 'High' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'LOW', label: 'Low' },
  ];

  constructor(private helpDesk: HelpDeskService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Help Desk' },
      { label: 'Tickets', active: true },
    ];
    this.loadStatistics();
    this.loadCategories();
    this.loadTickets();
  }

  loadStatistics(): void {
    this.helpDesk.getStatistics().subscribe({
      next: (res) => (this.stats = res?.statistics ?? this.stats),
      error: () => {},
    });
  }

  loadCategories(): void {
    this.helpDesk.getCategories().subscribe({
      next: (res) =>
        (this.categories = res?.help_desk_categories ?? res?.categories ?? []),
      error: () => {},
    });
  }

  loadTickets(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.helpDesk
      .getTickets({
        scope: this.scope,
        status: this.status,
        priority: this.priority,
        category_uuid: this.categoryUuid,
        search: this.search,
      })
      .subscribe({
        next: (res) => {
          this.tickets = res?.tickets ?? [];
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage =
            err?.error?.message ?? 'Could not load tickets. Please try again.';
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    this.loadTickets();
  }

  resetFilters(): void {
    this.scope = 'all';
    this.status = '';
    this.priority = '';
    this.categoryUuid = '';
    this.search = '';
    this.loadTickets();
  }

  statusClass(status: string): string {
    switch (status) {
      case 'OPEN':
        return 'badge bg-primary-subtle text-primary';
      case 'IN_PROGRESS':
        return 'badge bg-warning-subtle text-warning';
      case 'PENDING':
        return 'badge bg-info-subtle text-info';
      case 'RESOLVED':
        return 'badge bg-success-subtle text-success';
      case 'CLOSED':
        return 'badge bg-secondary-subtle text-secondary';
      default:
        return 'badge bg-light text-muted';
    }
  }

  priorityClass(priority: string): string {
    switch (priority) {
      case 'URGENT':
        return 'badge bg-danger-subtle text-danger';
      case 'HIGH':
        return 'badge bg-warning-subtle text-warning';
      case 'LOW':
        return 'badge bg-light text-muted';
      default:
        return 'badge bg-primary-subtle text-primary';
    }
  }

  statusLabel(status: string): string {
    const found = this.statuses.find((s) => s.value === status);
    return found ? found.label : status;
  }
}
