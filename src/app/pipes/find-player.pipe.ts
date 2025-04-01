import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'findPlayer'
})
export class FindPlayerPipe implements PipeTransform {
  transform(players: any[], playerId: number): any {
    return players.find(player => player.playerId === playerId) || {};
  }
}
