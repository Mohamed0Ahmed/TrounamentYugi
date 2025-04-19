import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerRoutingModule } from './player-routing.module';
import { LeagueTableComponent } from './league-table/league-table.component';
import { RankingComponent } from './ranking/ranking.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AllLeaguesComponent } from './all-leagues/all-leagues.component';
import { ForbiddenCardsComponent } from './forbidden-cards/forbidden-cards.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PlayerInboxComponent } from './player-inbox/player-inbox.component';

@NgModule({
  declarations: [
    LeagueTableComponent,
    RankingComponent,
    AllLeaguesComponent,
    ForbiddenCardsComponent,
    PlayerInboxComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    HttpClientModule,
    FormsModule,
    CarouselModule,
  ],
  exports: [RankingComponent],
})
export class PlayerModule {}
