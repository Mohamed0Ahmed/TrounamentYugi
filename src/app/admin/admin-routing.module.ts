import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { PlayersComponent } from './players/players.component';
import { InboxComponent } from './inbox/inbox.component';

const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'inbox', component: InboxComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
