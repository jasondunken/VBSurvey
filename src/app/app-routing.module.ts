import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyComponent } from './survey/survey.component';
import { SearchComponent } from './search/search.component';

const routes: Routes = [
  { path: '', component: SurveyComponent },
  { path: 'home', component: SurveyComponent },
  { path: 'survey', component: SurveyComponent },
  { path: 'search', component: SearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
