import { Component, OnInit } from '@angular/core';
import { HelpDeskService } from 'src/app/core/services/help-desk-card/help-desk.service';

@Component({
  selector: 'app-help-desk-categories',
  templateUrl: './help-desk-categories.component.html',
  styleUrl: './help-desk-categories.component.scss',
})
export class HelpDeskCategoriesComponent implements OnInit {
  breadCrumbItems!: Array<{}>;

  categories: any[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  // New category form
  newCategory = { name: '', description: '', icon: '' };
  isSaving = false;

  // Agent management for the expanded category
  expandedUuid = '';
  agents: any[] = [];
  newAgent = { user_id: null as number | null, role: 'AGENT' };

  constructor(private helpDesk: HelpDeskService) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Help Desk' },
      { label: 'Categories', active: true },
    ];
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.helpDesk.getCategories().subscribe({
      next: (res) => {
        this.categories = res?.help_desk_categories ?? res?.categories ?? [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Could not load categories.';
        this.isLoading = false;
      },
    });
  }

  createCategory(): void {
    if (!this.newCategory.name.trim()) return;
    this.isSaving = true;
    this.helpDesk.createCategory(this.newCategory).subscribe({
      next: () => {
        this.newCategory = { name: '', description: '', icon: '' };
        this.isSaving = false;
        this.flash('Category created.');
        this.load();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message ?? 'Could not create the category.';
        this.isSaving = false;
      },
    });
  }

  toggleActive(category: any): void {
    this.helpDesk
      .updateCategory(category.uuid, { is_active: !category.is_active })
      .subscribe({
        next: () => {
          category.is_active = !category.is_active;
          this.flash('Category updated.');
        },
        error: (err) => (this.errorMessage = err?.error?.message ?? 'Update failed.'),
      });
  }

  expand(category: any): void {
    if (this.expandedUuid === category.uuid) {
      this.expandedUuid = '';
      return;
    }
    this.expandedUuid = category.uuid;
    this.agents = [];
    this.helpDesk.getAgents(category.uuid).subscribe({
      next: (res) => (this.agents = res?.agents ?? []),
      error: () => {},
    });
  }

  addAgent(category: any): void {
    if (!this.newAgent.user_id) return;
    this.helpDesk
      .saveAgents(category.uuid, {
        user_ids: [this.newAgent.user_id],
        role: this.newAgent.role,
      })
      .subscribe({
        next: (res) => {
          this.agents = res?.agents ?? this.agents;
          this.newAgent = { user_id: null, role: 'AGENT' };
          this.flash('Agent added.');
        },
        error: (err) => (this.errorMessage = err?.error?.message ?? 'Could not add agent.'),
      });
  }

  removeAgent(category: any, agent: any): void {
    this.helpDesk.removeAgent(category.uuid, agent.user_id).subscribe({
      next: () => {
        this.agents = this.agents.filter((a) => a.user_id !== agent.user_id);
        this.flash('Agent removed.');
      },
      error: (err) => (this.errorMessage = err?.error?.message ?? 'Could not remove agent.'),
    });
  }

  private flash(message: string): void {
    this.successMessage = message;
    setTimeout(() => (this.successMessage = ''), 3000);
  }
}
