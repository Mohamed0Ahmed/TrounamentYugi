import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeagueTableComponent } from './league-table/league-table.component';
import { RankingComponent } from './ranking/ranking.component';
import { GroupsTableComponent } from './groups-table/groups-table.component';
import { GroupsMatchesTableComponent } from './groups-matches-table/groups-matches-table.component';
import { AllLeaguesComponent } from './all-leagues/all-leagues.component';
import { ForbiddenCardsComponent } from './forbidden-cards/forbidden-cards.component';
import { PlayerInboxComponent } from './player-inbox/player-inbox.component';
import { FriendliesViewComponent } from './friendlies/friendlies-view.component';
import { TeamsComponent } from './teams/teams.component';

const routes: Routes = [
  { path: '', redirectTo: 'ranking', pathMatch: 'full' },
  {
    path: 'league-table',
    component: LeagueTableComponent,
    data: { title: 'League Table' },
  },
  { path: 'ranking', component: RankingComponent, data: { title: 'Ranking' } },
  {
    path: 'groups-table',
    component: GroupsTableComponent,
    data: { title: 'Groups Table' },
  },
  {
    path: 'groups-matches-table',
    component: GroupsMatchesTableComponent,
    data: { title: 'Groups Matches Table' },
  },
  {
    path: 'allLeagues',
    component: AllLeaguesComponent,
    data: { title: 'All Leagues' },
  },
  {
    path: 'forbidden',
    component: ForbiddenCardsComponent,
    data: { title: 'Forbidden Cards' },
  },
  {
    path: 'inbox',
    component: PlayerInboxComponent,
    data: { title: 'Inbox' },
  },
  {
    path: 'friendlies',
    component: FriendliesViewComponent,
    data: { title: 'Friendlies' },
  },
  { path: 'teams', component: TeamsComponent, data: { title: 'Teams' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerRoutingModule {}
