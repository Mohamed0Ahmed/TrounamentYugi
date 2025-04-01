import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PlayersComponent } from './players/players.component';
import { InboxComponent } from './inbox/inbox.component';
import { FormsModule } from '@angular/forms';
import { FindPlayerPipe } from '../pipes/find-player.pipe';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { UtcToLocalPipe } from '../pipes/utcToLocal.pipe';
import { PlayerModule } from "../player/player.module";

@NgModule({
  declarations: [
    PlayersComponent,
    InboxComponent,
    FindPlayerPipe,
    AdminDashboardComponent,
    UtcToLocalPipe,
  ],
  imports: [CommonModule, AdminRoutingModule, FormsModule, HttpClientModule, PlayerModule],
})
export class AdminModule {}
