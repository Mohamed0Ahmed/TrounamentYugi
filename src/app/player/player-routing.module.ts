import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeagueTableComponent } from './league-table/league-table.component';
import { RankingComponent } from './ranking/ranking.component';
import { SendMessageComponent } from './send-message/send-message.component';

const routes: Routes = [
  { path: '', redirectTo: 'league-table', pathMatch: 'full' },
  { path: 'league-table', component: LeagueTableComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'send-message', component: SendMessageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlayerRoutingModule { }
