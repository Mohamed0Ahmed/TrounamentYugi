import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersComponent } from './players/players.component';
import { InboxComponent } from './inbox/inbox.component';
import { FriendliesComponent } from './friendlies/friendlies.component';
import { FriendlyInboxComponent } from './friendlies/friendly-inbox/friendly-inbox.component';
import { TeamsDashboardComponent } from './teams-dashboard/teams-dashboard.component';

const routes: Routes = [
  { path: '', component: PlayersComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'friendlies', component: FriendliesComponent },
  { path: 'friendly-inbox', component: FriendlyInboxComponent },
  { path: 'teams-dashboard', component: TeamsDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
