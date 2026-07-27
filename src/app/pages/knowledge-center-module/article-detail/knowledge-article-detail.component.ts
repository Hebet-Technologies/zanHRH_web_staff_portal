import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HelpDeskService } from 'src/app/core/services/help-desk-card/help-desk.service';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';

@Component({
  selector: 'app-knowledge-article-detail',
  templateUrl: './knowledge-article-detail.component.html',
  styleUrl: './knowledge-article-detail.component.scss',
})
export class KnowledgeArticleDetailComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  uuid = '';
  article: any = null;
  comments: any[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  replyMessage = '';
  isPosting = false;

  /** Same gate as the help desk: agents/admins manage, others view only. */
  canManage = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private helpDesk: HelpDeskService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.uuid = this.route.snapshot.paramMap.get('uuid') ?? '';
    this.breadCrumbItems = [{ label: 'Knowledge Center' }, { label: 'Announcement', active: true }];
    this.permissionService
      .hasPermission('View Help Desk Ticket')
      .subscribe((has) => (this.canManage = !!has));
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.helpDesk.getKnowledgePost(this.uuid).subscribe({
      next: (res) => {
        // The API envelope is { post: {...} }.
        this.article = res?.post ?? null;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Could not load the announcement.';
        this.isLoading = false;
      },
    });
  }

  togglePublish(): void {
    const newStatus = this.article.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    const formData = new FormData();
    formData.append('status', newStatus);
    this.helpDesk.updateKnowledgePost(this.uuid, formData).subscribe({
      next: (res) => {
        // Trust the server's copy — it also carries the new published_at.
        this.article = res?.post ?? { ...this.article, status: newStatus };
        this.successMessage = newStatus === 'PUBLISHED' ? 'Announcement published.' : 'Announcement moved to draft.';
        setTimeout(() => (this.successMessage = ''), 3500);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to update status.';
        setTimeout(() => (this.errorMessage = ''), 4000);
      },
    });
  }

  deleteArticle(): void {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    this.helpDesk.deleteKnowledgePost(this.uuid).subscribe({
      next: () => this.router.navigate(['/app/knowledge-center/articles']),
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Failed to delete.';
        setTimeout(() => (this.errorMessage = ''), 4000);
      },
    });
  }

  statusClass(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'badge bg-success-subtle text-success';
      case 'DRAFT': return 'badge bg-warning-subtle text-warning';
      default: return 'badge bg-secondary-subtle text-secondary';
    }
  }

  /**
   * The API exposes `attachment_url` (absolute when the storage disk is
   * configured with a URL, otherwise a `storage/...` relative path).
   */
  attachmentUrl(attachment: any): string {
    const raw = (attachment?.attachment_url ?? attachment?.file_path ?? '').toString().trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;

    const origin = environment.apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
    const path = raw.replace(/^\/+/, '');
    return `${origin}/${path.startsWith('storage/') ? path : `storage/${path}`}`;
  }

  authorName(): string {
    const a = this.article?.author;
    if (!a) return 'Unknown';
    return [a.first_name, a.middle_name, a.last_name].filter(Boolean).join(' ') || a.email;
  }
}
