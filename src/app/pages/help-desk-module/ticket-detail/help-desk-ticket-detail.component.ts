import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HelpDeskService } from 'src/app/core/services/help-desk-card/help-desk.service';

@Component({
  selector: 'app-help-desk-ticket-detail',
  templateUrl: './help-desk-ticket-detail.component.html',
  styleUrl: './help-desk-ticket-detail.component.scss',
})
export class HelpDeskTicketDetailComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  uuid = '';
  ticket: any = null;
  comments: any[] = [];
  agents: any[] = [];

  isLoading = true;
  isPosting = false;
  errorMessage = '';
  successMessage = '';

  // Composer
  replyMessage = '';
  isInternal = false;

  // Action models
  selectedAssignee: number | null = null;
  selectedStatus = '';
  selectedPriority = '';

  readonly statuses = [
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In progress' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  readonly priorities = ['LOW', 'NORMAL', 'HIGH', 'URGENT'];

  constructor(
    private route: ActivatedRoute,
    private helpDesk: HelpDeskService
  ) {}

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';
    this.breadCrumbItems = [
      { label: 'Help Desk' },
      { label: 'Ticket', active: true },
    ];
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.helpDesk.getTicket(this.uuid).subscribe({
      next: (res) => {
        this.ticket = res?.ticket ?? null;
        this.selectedStatus = this.ticket?.status ?? '';
        this.selectedPriority = this.ticket?.priority ?? '';
        this.selectedAssignee = this.ticket?.assigned_to ?? null;
        this.isLoading = false;
        if (this.ticket?.category_uuid) {
          this.loadAgents(this.ticket.category_uuid);
        }
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Could not load the ticket.';
        this.isLoading = false;
      },
    });

    this.helpDesk.getComments(this.uuid).subscribe({
      next: (res) => (this.comments = (res?.comments ?? []).slice().reverse()),
      error: () => {},
    });
  }

  loadAgents(categoryUuid: string): void {
    this.helpDesk.getAgents(categoryUuid).subscribe({
      next: (res) => (this.agents = res?.agents ?? []),
      error: () => {},
    });
  }

  sendReply(): void {
    const message = this.replyMessage.trim();
    if (!message) return;
    this.isPosting = true;
    this.helpDesk
      .postComment(this.uuid, { message, is_internal: this.isInternal })
      .subscribe({
        next: (res) => {
          if (res?.comment) this.comments = [...this.comments, res.comment];
          if (res?.ticket) this.ticket = res.ticket;
          this.replyMessage = '';
          this.isInternal = false;
          this.isPosting = false;
        },
        error: (err) => {
          this.errorMessage = err?.error?.message ?? 'Could not post the reply.';
          this.isPosting = false;
        },
      });
  }

  claim(): void {
    this.helpDesk.claimTicket(this.uuid).subscribe({
      next: (res) => this.afterAction(res, 'You picked up this ticket.'),
      error: (err) => this.flashError(err),
    });
  }

  assign(): void {
    this.helpDesk.assignTicket(this.uuid, this.selectedAssignee).subscribe({
      next: (res) => this.afterAction(res, 'Assignment updated.'),
      error: (err) => this.flashError(err),
    });
  }

  changeStatus(): void {
    this.helpDesk
      .updateStatus(this.uuid, this.selectedStatus, this.selectedPriority)
      .subscribe({
        next: (res) => this.afterAction(res, 'Status updated.'),
        error: (err) => this.flashError(err),
      });
  }

  togglePublish(): void {
    const makePublic = !this.ticket?.is_public;
    this.helpDesk
      .setVisibility(this.uuid, makePublic, this.ticket?.subject)
      .subscribe({
        next: (res) =>
          this.afterAction(
            res,
            makePublic
              ? 'Published to the knowledge base.'
              : 'Removed from the knowledge base.'
          ),
        error: (err) => this.flashError(err),
      });
  }

  private afterAction(res: any, message: string): void {
    if (res?.ticket) {
      this.ticket = res.ticket;
      this.selectedStatus = this.ticket.status;
      this.selectedPriority = this.ticket.priority;
      this.selectedAssignee = this.ticket.assigned_to ?? null;
    }
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3500);
  }

  private flashError(err: any): void {
    this.errorMessage = err?.error?.message ?? 'Action failed. Please try again.';
    setTimeout(() => (this.errorMessage = ''), 4000);
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

  agentName(agent: any): string {
    return agent?.user?.full_name || `User #${agent?.user_id}`;
  }

  isNote(comment: any): boolean {
    return comment?.is_internal === true || comment?.sub_category === 'internal_note';
  }
}
