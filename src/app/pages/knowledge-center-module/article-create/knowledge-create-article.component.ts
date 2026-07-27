import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpDeskService } from 'src/app/core/services/help-desk-card/help-desk.service';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';

@Component({
  selector: 'app-knowledge-create-article',
  templateUrl: './knowledge-create-article.component.html',
  styleUrls: ['./knowledge-create-article.component.scss'],
})
export class KnowledgeCreateArticleComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  isSubmitting = false;
  errorMessage = '';
  isEdit = false;
  articleUuid = '';

  categories: any[] = [];
  selectedCategoryUuid = '';
  title = '';
  body = '';
  status = 'DRAFT';
  attachments: File[] = [];
  existingAttachments: any[] = [];

  readonly statuses = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
  ];

  constructor(
    private helpDesk: HelpDeskService,
    private router: Router,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    // View-only users have no business on the create/edit form — the API
    // would reject the save anyway, so bounce them back to the list.
    this.permissionService
      .hasPermission('View Help Desk Ticket')
      .subscribe((has) => {
        if (!has) this.router.navigate(['/app/knowledge-center/articles']);
      });

    this.articleUuid = this.route.snapshot.paramMap.get('uuid') ?? '';
    this.isEdit = !!this.articleUuid || this.route.snapshot.url.some(s => s.path === 'edit');

    if (this.isEdit && this.articleUuid) {
      this.breadCrumbItems = [{ label: 'Knowledge Center' }, { label: 'Edit Announcement', active: true }];
      this.loadArticle();
    } else {
      this.breadCrumbItems = [{ label: 'Knowledge Center' }, { label: 'New Announcement', active: true }];
    }
    this.loadCategories();
  }

  loadCategories(): void {
    this.helpDesk.getCategories().subscribe({
      next: (res) => (this.categories = (res?.help_desk_categories ?? res?.categories ?? []).filter((c: any) => c.is_active)),
      error: () => {},
    });
  }

  loadArticle(): void {
    this.helpDesk.getKnowledgePost(this.articleUuid).subscribe({
      next: (res) => {
        const post = res?.post ?? null;
        if (post) {
          this.title = post.title ?? '';
          this.body = post.body ?? '';
          this.selectedCategoryUuid = post.category?.uuid ?? post.category_uuid ?? '';
          this.status = post.status ?? 'DRAFT';
          this.existingAttachments = post.attachments ?? [];
        }
      },
      error: () => {},
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.attachments = [...this.attachments, ...Array.from(input.files)];
    }
  }

  removeAttachment(index: number): void { this.attachments.splice(index, 1); }
  removeExistingAttachment(index: number): void { this.existingAttachments.splice(index, 1); }

  onSubmit(): void {
    if (!this.selectedCategoryUuid || !this.title.trim() || !this.body.trim()) return;
    this.isSubmitting = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('category_uuid', this.selectedCategoryUuid);
    formData.append('title', this.title.trim());
    formData.append('body', this.body.trim());
    formData.append('status', this.status);
    this.attachments.forEach((file) => formData.append('attachments[]', file));

    const obs = this.isEdit
      ? this.helpDesk.updateKnowledgePost(this.articleUuid, formData)
      : this.helpDesk.createKnowledgePost(formData);

    obs.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        const uuid = res?.post?.uuid;
        this.router.navigate(uuid ? ['/app/knowledge-center/articles', uuid] : ['/app/knowledge-center/articles']);
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = typeof err === 'string'
          ? err
          : err?.error?.message ?? err?.message ?? 'Failed to save announcement. Please try again.';
        this.errorMessage = msg || 'Failed to save announcement. Please try again.';
      },
    });
  }
}
