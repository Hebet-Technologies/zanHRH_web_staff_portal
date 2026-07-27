import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';

import { KnowledgeCenterModuleRoutingModule } from './knowledge-center-module-routing.module';
import { KnowledgeArticlesComponent } from './articles/knowledge-articles.component';
import { KnowledgeArticleDetailComponent } from './article-detail/knowledge-article-detail.component';
import { KnowledgeCreateArticleComponent } from './article-create/knowledge-create-article.component';

@NgModule({
  declarations: [
    KnowledgeArticlesComponent,
    KnowledgeArticleDetailComponent,
    KnowledgeCreateArticleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    KnowledgeCenterModuleRoutingModule,
    NgbPaginationModule,
    NgbTooltipModule,
    SharedModule,
  ],
})
export class KnowledgeCenterModuleModule {}
