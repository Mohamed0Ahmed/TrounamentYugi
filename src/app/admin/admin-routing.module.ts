import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayersComponent } from './players/players.component';
import { InboxComponent } from './inbox/inbox.component';

const routes: Routes = [
  { path: '', component: PlayersComponent },
  { path: 'players', component: PlayersComponent },
  { path: 'inbox', component: InboxComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
