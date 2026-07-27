import { Component, OnInit } from '@angular/core';
import { HelpDeskService } from 'src/app/core/services/help-desk-card/help-desk.service';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';

@Component({
  selector: 'app-knowledge-articles',
  templateUrl: './knowledge-articles.component.html',
  styleUrl: './knowledge-articles.component.scss',
})
export class KnowledgeArticlesComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  isLoading = true;
  errorMessage = '';

  articles: any[] = [];
  categories: any[] = [];

  search = '';
  categoryUuid = '';
  status = '';

  // The API paginates. Keep the meta so the user can page through everything
  // instead of silently seeing only the first slice.
  page = 1;
  perPage = 25;
  lastPage = 1;
  total = 0;

  readonly statuses = [
    { value: '', label: 'Any status' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'DRAFT', label: 'Draft' },
  ];

  /** Same gate as the help desk: agents/admins manage, others view only. */
  canManage = false;

  constructor(
    private helpDesk: HelpDeskService,
    private permissionService: PermissionService,
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Knowledge Center' }, { label: 'Announcements', active: true }];
    this.permissionService
      .hasPermission('View Help Desk Ticket')
      .subscribe((has) => (this.canManage = !!has));
    this.loadCategories();
    this.loadArticles();
  }

  loadCategories(): void {
    this.helpDesk.getCategories().subscribe({
      next: (res) => (this.categories = res?.help_desk_categories ?? res?.categories ?? []),
      error: () => {},
    });
  }

  loadArticles(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.helpDesk
      .getKnowledgePosts({
        search: this.search,
        category_uuid: this.categoryUuid,
        status: this.status,
        perPage: this.perPage,
        page: this.page,
      })
      .subscribe({
        next: (res) => {
          // The API envelope is { posts: [...], pagination: {...} }.
          this.articles = res?.posts ?? [];
          const meta = res?.pagination;
          this.page = meta?.current_page ?? this.page;
          this.lastPage = meta?.last_page ?? 1;
          this.total = meta?.total ?? this.articles.length;
          this.isLoading = false;
        },
        error: (err) => {
          this.articles = [];
          this.errorMessage = err?.error?.message ?? 'Could not load announcements.';
          this.isLoading = false;
        },
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadArticles();
  }

  resetFilters(): void {
    this.search = '';
    this.categoryUuid = '';
    this.status = '';
    this.page = 1;
    this.loadArticles();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage || page === this.page) return;
    this.page = page;
    this.loadArticles();
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.lastPage }, (_, i) => i + 1);
  }

  attachmentCount(article: any): number {
    return Array.isArray(article?.attachments) ? article.attachments.length : 0;
  }

  statusClass(status: string): string {
    switch (status) {
      case 'PUBLISHED': return 'badge bg-success-subtle text-success';
      case 'DRAFT': return 'badge bg-warning-subtle text-warning';
      default: return 'badge bg-secondary-subtle text-secondary';
    }
  }
}
