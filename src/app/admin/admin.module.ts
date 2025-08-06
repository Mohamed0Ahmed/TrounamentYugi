import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { PlayersComponent } from './players/players.component';
import { InboxComponent } from './inbox/inbox.component';
import { FriendliesComponent } from './friendlies/friendlies.component';
import { FriendlyInboxComponent } from './friendlies/friendly-inbox/friendly-inbox.component';
import { FormsModule } from '@angular/forms';
import { FindPlayerPipe } from '../pipes/find-player.pipe';
import { HttpClientModule } from '@angular/common/http';
import { UtcToLocalPipe } from '../pipes/utcToLocal.pipe';
import { PlayerModule } from '../player/player.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PlayersComponent,
    InboxComponent,
    FriendliesComponent,
    FriendlyInboxComponent,
    FindPlayerPipe,
    UtcToLocalPipe,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    HttpClientModule,
    PlayerModule,
    SharedModule,
  ],
})
export class AdminModule {}
