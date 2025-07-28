import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeagueTableComponent } from './league-table/league-table.component';
import { RankingComponent } from './ranking/ranking.component';
import { GroupsTableComponent } from './groups-table/groups-table.component';
import { GroupsMatchesTableComponent } from './groups-matches-table/groups-matches-table.component';
import { AllLeaguesComponent } from './all-leagues/all-leagues.component';
import { ForbiddenCardsComponent } from './forbidden-cards/forbidden-cards.component';
import { PlayerInboxComponent } from './player-inbox/player-inbox.component';

const routes: Routes = [
  { path: '', redirectTo: 'ranking', pathMatch: 'full' },
  { path: 'league-table', component: LeagueTableComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'groups-table', component: GroupsTableComponent },
  { path: 'groups-matches-table', component: GroupsMatchesTableComponent },
  { path: 'allLeagues', component: AllLeaguesComponent },
  { path: 'forbidden', component: ForbiddenCardsComponent },
  { path: 'inbox', component: PlayerInboxComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerRoutingModule {}
