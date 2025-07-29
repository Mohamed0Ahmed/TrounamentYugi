import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerRoutingModule } from './player-routing.module';
import { LeagueTableComponent } from './league-table/league-table.component';
import { RankingComponent } from './ranking/ranking.component';
import { GroupsTableComponent } from './groups-table/groups-table.component';
import { GroupsMatchesTableComponent } from './groups-matches-table/groups-matches-table.component';
import { LeagueGroupsPreviewComponent } from './league-groups-preview/league-groups-preview.component';
import { TournamentInfoComponent } from './tournament-info/tournament-info.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AllLeaguesComponent } from './all-leagues/all-leagues.component';
import { ForbiddenCardsComponent } from './forbidden-cards/forbidden-cards.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { PlayerInboxComponent } from './player-inbox/player-inbox.component';
import { SharedModule } from '../shared/shared.module';
import { BracketTreeComponent } from './bracket-tree/bracket-tree.component';
import { GroupDrawAnimationComponent } from './group-draw-animation/group-draw-animation.component';

@NgModule({
  declarations: [
    LeagueTableComponent,
    RankingComponent,
    GroupsTableComponent,
    GroupsMatchesTableComponent,
    LeagueGroupsPreviewComponent,
    TournamentInfoComponent,
    AllLeaguesComponent,
    ForbiddenCardsComponent,
    PlayerInboxComponent,
    GroupDrawAnimationComponent,
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    HttpClientModule,
    FormsModule,
    CarouselModule,
    SharedModule,
    BracketTreeComponent,
  ],
  exports: [RankingComponent],
})
export class PlayerModule {}
