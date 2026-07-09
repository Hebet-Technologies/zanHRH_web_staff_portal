import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpDeskService } from 'src/app/core/services/help-desk-card/help-desk.service';

@Component({
  selector: 'app-help-desk-create-ticket',
  templateUrl: './help-desk-create-ticket.component.html',
  styleUrls: ['./help-desk-create-ticket.component.scss'],
})
export class HelpDeskCreateTicketComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  isSubmitting = false;
  errorMessage = '';

  categories: any[] = [];
  selectedCategoryUuid = '';
  subject = '';
  content = '';
  priority = 'NORMAL';
  attachments: File[] = [];

  readonly priorities = [
    { value: 'LOW', label: 'Low' },
    { value: 'NORMAL', label: 'Normal' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  constructor(private helpDesk: HelpDeskService, private router: Router) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Help Desk' },
      { label: 'Create Ticket', active: true },
    ];
    this.loadCategories();
  }

  loadCategories(): void {
    this.helpDesk.getCategories().subscribe({
      next: (res) =>
        (this.categories = (res?.help_desk_categories ?? res?.categories ?? []).filter(
          (c: any) => c.is_active
        )),
      error: () => {},
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.attachments = Array.from(input.files);
    }
  }

  removeAttachment(index: number): void {
    this.attachments.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.selectedCategoryUuid || !this.content.trim()) return;

    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('category_uuid', this.selectedCategoryUuid);
    if (this.subject.trim()) formData.append('subject', this.subject.trim());
    formData.append('content', this.content.trim());
    formData.append('priority', this.priority);
    this.attachments.forEach((file) => formData.append('attachments[]', file));

    this.helpDesk.createTicket(formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        const uuid = res?.ticket?.uuid ?? res?.uuid;
        if (uuid) {
          this.router.navigate(['/app/help-desk/tickets', uuid]);
        } else {
          this.router.navigate(['/app/help-desk/tickets']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage =
          err?.error?.message ?? 'Failed to create ticket. Please try again.';
      },
    });
  }
}
