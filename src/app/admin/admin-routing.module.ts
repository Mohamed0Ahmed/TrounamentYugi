import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersComponent } from './players/players.component';
import { InboxComponent } from './inbox/inbox.component';
import { FriendliesComponent } from './friendlies/friendlies.component';
import { FriendlyInboxComponent } from './friendlies/friendly-inbox/friendly-inbox.component';
import { TeamsDashboardComponent } from './teams-dashboard/teams-dashboard.component';

const routes: Routes = [
  { path: '', component: PlayersComponent, data: { title: 'Players' } },
  {
    path: 'players',
    component: PlayersComponent,
    data: { title: 'Players' },
  },
  { path: 'inbox', component: InboxComponent, data: { title: 'Inbox' } },
  {
    path: 'friendlies',
    component: FriendliesComponent,
    data: { title: 'Friendlies' },
  },
  {
    path: 'friendly-inbox',
    component: FriendlyInboxComponent,
    data: { title: 'Friendly Inbox' },
  },
  {
    path: 'teams-dashboard',
    component: TeamsDashboardComponent,
    data: { title: 'Teams Dashboard' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
