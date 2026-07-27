import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KnowledgeArticlesComponent } from './articles/knowledge-articles.component';
import { KnowledgeArticleDetailComponent } from './article-detail/knowledge-article-detail.component';
import { KnowledgeCreateArticleComponent } from './article-create/knowledge-create-article.component';

const routes: Routes = [
  { path: '', redirectTo: 'articles', pathMatch: 'full' },
  { path: 'articles', component: KnowledgeArticlesComponent },
  { path: 'articles/create', component: KnowledgeCreateArticleComponent },
  { path: 'articles/:uuid', component: KnowledgeArticleDetailComponent },
  { path: 'articles/:uuid/edit', component: KnowledgeCreateArticleComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KnowledgeCenterModuleRoutingModule {}
