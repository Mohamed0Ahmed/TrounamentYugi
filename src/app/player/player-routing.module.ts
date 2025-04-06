import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeagueTableComponent } from './league-table/league-table.component';
import { RankingComponent } from './ranking/ranking.component';
import { SendMessageComponent } from './send-message/send-message.component';
import { AllLeaguesComponent } from './all-leagues/all-leagues.component';
import { ForbiddenCardsComponent } from './forbidden-cards/forbidden-cards.component';

const routes: Routes = [
  { path: '', redirectTo: 'ranking', pathMatch: 'full' },
  { path: 'league-table', component: LeagueTableComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'send-message', component: SendMessageComponent },
  { path: 'allLeagues', component: AllLeaguesComponent },
  { path: 'forbidden', component: ForbiddenCardsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerRoutingModule {}
